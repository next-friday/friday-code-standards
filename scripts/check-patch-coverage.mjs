import console from "node:console";
import {execFileSync} from "node:child_process";
import path from "node:path";
import process from "node:process";
import {readFileSync} from "node:fs";

const DEFAULT_COMPARE_BRANCH = "origin/main";
const DEFAULT_FAIL_UNDER = 95;
const HIT = "hit";
const MISS = "miss";
const PARTIAL = "partial";
const SEPARATOR = "-------------";
const UNTRACKED = "untracked";

/**
 * @typedef {object} FileCoverage
 * @property {Map<number, boolean>} branches Whether each source line has an uncovered branch.
 * @property {Map<number, number>} lines Execution hit counts keyed by source line.
 */

/**
 * @typedef {object} PatchCoverageFile
 * @property {number} hits Fully covered changed lines.
 * @property {number} misses Uncovered changed lines.
 * @property {number} partials Partially covered changed lines.
 * @property {string} sourcePath Repository-relative source path.
 * @property {number} total Executable changed lines.
 */

/**
 * Add one Git diff hunk's changed line numbers to the current source path.
 * @param {Map<string, Set<number>>} changedLines Changed line numbers keyed by source path.
 * @param {string | undefined} currentPath Current repository-relative source path.
 * @param {string} diffLine One zero-context Git diff line.
 * @returns {void} Nothing.
 */
function appendChangedHunkLines(changedLines, currentPath, diffLine) {
  if (currentPath === undefined || !diffLine.startsWith("@@")) {
    return;
  }

  const match = /\+(\d+)(?:,(\d+))?/u.exec(diffLine);

  if (match === null) {
    return;
  }

  const lines = changedLines.get(currentPath);

  if (lines === undefined) {
    return;
  }

  const start = Number(match[1]);
  const count = Number(match[2] ?? "1");

  for (let offset = 0; offset < count; offset += 1) {
    lines.add(start + offset);
  }
}

/**
 * Record one LCOV branch datum.
 * @param {FileCoverage} report Coverage report to mutate.
 * @param {string} rawLine LCOV BRDA record.
 * @returns {void} Nothing.
 */
function applyBranchCoverage(report, rawLine) {
  const branchData = rawLine.slice(5).split(",", 4);
  const line = Number(branchData[0]);

  if (!Number.isSafeInteger(line)) {
    return;
  }

  const taken = branchData[3];
  const hasUncoveredBranch = taken === "-" || Number(taken) === 0;
  const existing = report.branches.get(line) ?? false;

  report.branches.set(line, existing || hasUncoveredBranch);
}

/**
 * Record one LCOV line datum.
 * @param {FileCoverage} report Coverage report to mutate.
 * @param {string} rawLine LCOV DA record.
 * @returns {void} Nothing.
 */
function applyDataCoverage(report, rawLine) {
  const [lineText, hitsText] = rawLine.slice(3).split(",", 2);
  const line = Number(lineText);
  const hits = Number(hitsText);

  if (Number.isSafeInteger(line) && Number.isFinite(hits)) {
    report.lines.set(line, (report.lines.get(line) ?? 0) + hits);
  }
}

/**
 * Classify one executable changed line using Codecov patch semantics.
 * @param {FileCoverage} report Coverage report for the source file.
 * @param {number} line Source line number.
 * @returns {"hit" | "miss" | "partial" | "untracked"} Patch coverage classification.
 */
function assessLineCoverage(report, line) {
  const hits = report.lines.get(line);
  const hasUncoveredBranch = report.branches.get(line);

  if (hits === undefined && hasUncoveredBranch === undefined) {
    return UNTRACKED;
  }

  if (hits === undefined) {
    return hasUncoveredBranch === true ? PARTIAL : HIT;
  }

  if (hits === 0) {
    return MISS;
  }

  return hasUncoveredBranch === true ? PARTIAL : HIT;
}

/**
 * Calculate one source file's changed-line coverage.
 * @param {FileCoverage} report Coverage report for the source file.
 * @param {Set<number> | undefined} changed Changed line numbers for the source file.
 * @param {string} sourcePath Repository-relative source path.
 * @returns {PatchCoverageFile} Patch coverage result for one source file.
 */
function buildPatchCoverageFile(report, changed, sourcePath) {
  const result = {
    hits: 0,
    misses: 0,
    partials: 0,
  };

  const lines = changed ?? [];

  for (const line of lines) {
    const classification = assessLineCoverage(report, line);

    result.hits += Number(classification === HIT);
    result.misses += Number(classification === MISS);
    result.partials += Number(classification === PARTIAL);
  }

  return {
    sourcePath,
    ...result,
    total: result.hits + result.partials + result.misses,
  };
}

/**
 * Get or create a source-file coverage report.
 * @param {Map<string, FileCoverage>} reports Reports keyed by repository-relative path.
 * @param {string} sourcePath Repository-relative source path.
 * @returns {FileCoverage} Existing or newly created report.
 */
function buildReport(reports, sourcePath) {
  const existing = reports.get(sourcePath);

  if (existing !== undefined) {
    return existing;
  }

  const report = {
    branches: new Map(),
    lines: new Map(),
  };

  reports.set(sourcePath, report);

  return report;
}

/**
 * Calculate Codecov-compatible coverage over changed executable lines.
 * @param {Map<string, FileCoverage>} coverage Coverage reports keyed by source path.
 * @param {Map<string, Set<number>>} changedLines Changed line numbers keyed by source path.
 * @returns {{files: PatchCoverageFile[], hits: number, misses: number, partials: number}} Patch coverage totals.
 */
function calculatePatchCoverage(coverage, changedLines) {
  const files = [];
  let hits = 0;
  let misses = 0;
  let partials = 0;

  for (const [sourcePath, report] of coverage) {
    const file = buildPatchCoverageFile(report, changedLines.get(sourcePath), sourcePath);

    hits += file.hits;
    misses += file.misses;
    partials += file.partials;

    if (file.total > 0) {
      files.push(file);
    }
  }

  return {
    files,
    hits,
    misses,
    partials,
  };
}

/**
 * Convert an LCOV source path to a repository-relative path.
 * @param {string} sourcePath LCOV source path.
 * @returns {string} Repository-relative path with forward slashes.
 */
function canonicalizeSourcePath(sourcePath) {
  const root = process.cwd();
  const absolute = path.resolve(sourcePath);

  return path.relative(root, absolute).replaceAll("\\", "/");
}

/**
 * Merge one source report into another.
 * @param {FileCoverage} target Aggregate report to mutate.
 * @param {FileCoverage} source Source report to merge.
 * @returns {void} Nothing.
 */
function combineCoverage(target, source) {
  for (const [line, hits] of source.lines) {
    target.lines.set(line, (target.lines.get(line) ?? 0) + hits);
  }

  for (const [line, hasUncoveredBranch] of source.branches) {
    const existing = target.branches.get(line) ?? false;

    target.branches.set(line, existing || hasUncoveredBranch);
  }
}

/**
 * Parse one LCOV file into per-source reports.
 * @param {string} filePath LCOV file path.
 * @returns {Map<string, FileCoverage>} Coverage reports keyed by repository-relative path.
 */
function extractLcovReports(filePath) {
  const reports = new Map();
  let current;

  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/u)) {
    if (rawLine.startsWith("SF:")) {
      const sourcePath = canonicalizeSourcePath(rawLine.slice(3));

      current = buildReport(reports, sourcePath);
    }

    if (current !== undefined && rawLine.startsWith("DA:")) {
      applyDataCoverage(current, rawLine);
    }

    if (current !== undefined && rawLine.startsWith("BRDA:")) {
      applyBranchCoverage(current, rawLine);
    }
  }

  return reports;
}

/**
 * Load and combine one or more LCOV files.
 * @param {string[]} coverageFiles LCOV files to load.
 * @returns {Map<string, FileCoverage>} Combined coverage keyed by source path.
 */
function loadCoverage(coverageFiles) {
  const coverage = new Map();

  for (const filePath of coverageFiles) {
    for (const [sourcePath, report] of extractLcovReports(filePath)) {
      const target = buildReport(coverage, sourcePath);

      combineCoverage(target, report);
    }
  }

  return coverage;
}

/**
 * Parse command-line arguments.
 * @param {string[]} argumentList CLI arguments excluding the Node executable and script path.
 * @returns {{compareBranch: string, coverageFiles: string[], failUnder: number}} Parsed options.
 */
function parseArguments(argumentList) {
  const coverageFiles = [];
  let compareBranch = DEFAULT_COMPARE_BRANCH;
  let failUnder = DEFAULT_FAIL_UNDER;
  let index = 0;

  while (index < argumentList.length) {
    const argument = argumentList[index];

    if (argument === "--compare-branch") {
      compareBranch = argumentList[index + 1] ?? compareBranch;
      index += 2;
    } else if (argument === "--fail-under") {
      failUnder = Number(argumentList[index + 1] ?? failUnder);
      index += 2;
    } else {
      coverageFiles.push(argument);
      index += 1;
    }
  }

  if (coverageFiles.length === 0) {
    throw new Error("At least one LCOV file is required.");
  }

  if (!Number.isFinite(failUnder) || failUnder < 0 || failUnder > 100) {
    throw new Error("--fail-under must be a number between 0 and 100.");
  }

  return {
    compareBranch,
    coverageFiles,
    failUnder,
  };
}

/**
 * Parse added line numbers from the branch-to-HEAD diff.
 * @param {string} compareBranch Git branch or revision to compare against HEAD.
 * @param {Iterable<string>} sourcePaths Coverage source paths to constrain the diff.
 * @returns {Map<string, Set<number>>} Added line numbers keyed by source path.
 */
function parseChangedLines(compareBranch, sourcePaths) {
  const diff = execFileSync(
    "/usr/bin/git",
    ["diff", "--unified=0", `${compareBranch}...HEAD`, "--", ...sourcePaths],
    {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );

  const changedLines = new Map();
  let currentPath;

  for (const line of diff.split(/\r?\n/u)) {
    if (line.startsWith("+++ b/")) {
      currentPath = line.slice(6);
      changedLines.set(currentPath, changedLines.get(currentPath) ?? new Set());
    } else {
      appendChangedHunkLines(changedLines, currentPath, line);
    }
  }

  return changedLines;
}

/**
 * Convert hit and total counts to a percentage.
 * @param {number} hits Covered line count.
 * @param {number} total Executable line count.
 * @returns {number} Coverage percentage.
 */
function percentage(hits, total) {
  return total === 0 ? 100 : (hits / total) * 100;
}

const {compareBranch, coverageFiles, failUnder} = parseArguments(process.argv.slice(2));

const coverage = loadCoverage(coverageFiles);
const changedLines = parseChangedLines(compareBranch, coverage.keys());
const result = calculatePatchCoverage(coverage, changedLines);
const total = result.hits + result.partials + result.misses;
const patchCoverage = percentage(result.hits, total);

console.log(SEPARATOR);
console.log("Codecov-compatible Patch Coverage");
console.log(`Diff: ${compareBranch}...HEAD`);
console.log(SEPARATOR);

for (const file of result.files) {
  const fileCoverage = percentage(file.hits, file.total).toFixed(5);

  console.log(
    `${file.sourcePath}: ${fileCoverage}% (${file.misses} misses, ${file.partials} partials)`,
  );
}

console.log(SEPARATOR);
console.log(`Hits: ${result.hits}`);
console.log(`Partials: ${result.partials}`);
console.log(`Misses: ${result.misses}`);
console.log(`Total: ${total}`);
console.log(`Coverage: ${patchCoverage.toFixed(5)}%`);
console.log(`Required: ${failUnder.toFixed(2)}%`);
console.log(SEPARATOR);

if (patchCoverage < failUnder) {
  console.error(
    `Patch coverage ${patchCoverage.toFixed(5)}% is below the required ${failUnder.toFixed(2)}%.`,
  );

  process.exitCode = 1;
}
