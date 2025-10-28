"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const runtimeDetector_1 = require("./core/runtimeDetector");
const program = new commander_1.Command();
program
    .name("nili")
    .description("The intelligent local runtime detector and runner")
    .version("0.1.0");
program
    .command("run")
    .description("Detect runtime and run the project")
    .action(() => {
    const runtime = (0, runtimeDetector_1.detectRuntime)();
    console.log(`[Nili] Detected runtime: ${runtime}`);
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map