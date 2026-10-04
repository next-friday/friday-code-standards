import {assert, describe, expect, it} from "vitest";
import path from "node:path";

import {packageRoot} from "../helpers";

import {eslint} from "./behavior.helper";

describe("Markdown behavior", () => {
  it("reports malformed ATX heading spacing", async () => {
    const [result] = await eslint.lintText("#Heading\n", {
      filePath: path.resolve(packageRoot, "fixtures/sample.md"),
    });

    assert(result);

    expect(result.messages.map(message => message.ruleId)).toContain(
      "markdown/no-missing-atx-heading-space",
    );
  });

  it("ignores YAML front matter when linting Markdown headings", async () => {
    const source = "---\n# Metadata title\ndescription: Example\n---\n\n# Page\n";

    const [result] = await eslint.lintText(source, {
      filePath: path.resolve(packageRoot, "fixtures/sample.md"),
    });

    assert(result);
    expect(result.messages).toEqual([]);
  });
});
