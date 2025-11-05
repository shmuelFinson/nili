#!/usr/bin/env node

import { Command } from "commander";
import { detectRuntime } from "./core/runtimeDetector";
import { runRuntime } from "./core/runtimeRunner";
import path from "path/win32";
import fs from "fs";
import { runRuntimeWithConfig } from "./core/runtimeRunner";
const program = new Command();

// ----------------- CLI -----------------
program
  .name("nili")
  .description("The intelligent local runtime detector and runner")
  .version("0.1.0");

program
  .command("run")
  .description("Detect runtime and run the project")
  .action(async () => {
    console.log("[Nili] Starting runtime detection...");
    const cwd = process.cwd();
    const configPath = path.join(cwd, "nili.config.json");
    let runtime: string | null = null;

    if (fs.existsSync(configPath)) {
        console.log("[Nili] Found nili.config.json, using config...");
      // Load config instead of detecting
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      runtime = null; // runtime is per entry/role in config
      await runRuntimeWithConfig(config, cwd); // new function to handle config
    } else {
      // fallback: detect runtime dynamically
      runtime = detectRuntime(cwd);
      if (!runtime || runtime === "unknown") {
        console.error("[Nili] Could not detect runtime!");
        process.exit(1);
      }
      console.log(`[Nili] Detected runtime: ${runtime}`);
      await runRuntime(runtime, cwd);
    }
  });

program
  .command("detect")
  .description("Only detect the runtime without running")
  .action(() => {
    const runtime = detectRuntime(process.cwd());
    console.log(`[Nili] Detected runtime: ${runtime}`);
  });

program.parse(process.argv);
