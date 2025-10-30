#!/usr/bin/env node

import { Command } from "commander";
import { detectRuntime } from "./core/runtimeDetector";
import { runRuntime } from "./core/runtimeRunner";

const program = new Command();

// ----------------- CLI -----------------
program
  .name("nili")
  .description("The intelligent local runtime detector and runner")
  .version("0.1.0");

program
  .command("run")
  .description("Detect runtime and run the project")
  .action(() => {
    const runtime = detectRuntime(process.cwd());
    if (!runtime || runtime === "unknown") {
      console.error("[Nili] Could not detect runtime!");
      process.exit(1);
    }

    console.log(`[Nili] Detected runtime: ${runtime}`);
    runRuntime(runtime, process.cwd());
  });

program
  .command("detect")
  .description("Only detect the runtime without running")
  .action(() => {
    const runtime = detectRuntime(process.cwd());
    console.log(`[Nili] Detected runtime: ${runtime}`);
  });

program.parse(process.argv);
