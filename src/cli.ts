#!/usr/bin/env node

import { Command } from "commander";
import { detectRuntime } from "./core/runtimeDetector";
import { runRuntime } from "./core/runtimeRunner";

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

    if (!runtime || runtime === "unknown") {
      console.log("[Nili] Could not detect runtime!");
      return;
    }

    console.log(`[Nili] Detected runtime: ${runtime}`);
    runRuntime(runtime);
  });

program
  .command("detect")
  .description("Only detect the runtime without running")
  .action(() => {
    const runtime = detectRuntime();
    console.log(`[Nili] Detected runtime: ${runtime}`);
  });

program.parse(process.argv);
