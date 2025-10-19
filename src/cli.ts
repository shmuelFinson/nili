#!/usr/bin/env node
import { Command } from "commander";
//import { detectRuntime } from "./core/runtimeDetector";

const program = new Command();

program
  .name("nili")
  .description("The intelligent way to detect, build, and run code locally.")
  .version("0.1.0");

program
  .command("run")
  .description("Detect runtime and run the project")
  .action(() => {
    const runtime = "Node.js"; //detectRuntime();
    console.log(`[Nili] Detected runtime: ${runtime}`);
  });

program.parse(process.argv);
