import {TestOnlyProvider} from "../test-only-provider.js";

declare function Module(options: {providers: unknown[]}): ClassDecorator;

@Module({providers: [TestOnlyProvider]})
export class TestOnlyModule {}
