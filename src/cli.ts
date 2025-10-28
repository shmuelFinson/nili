import { Command } from "commander";
import { detectRuntime } from "./core/runtimeDetector";

const program = new Command();

program
  .name("nili")
  .description("The intelligent local runtime detector and runner")
  .version("0.1.0");

program
  .command("run")
  .description("Detect runtime and run the project")
  .action(() => {
    const runtime = detectRuntime();
    console.log(`[Nili] Detected runtime: ${runtime}`);
  });

program.parse(process.argv);