import fs from "fs";
import path from "path";
import { detectNode } from "./runtimes/node";
 import { detectPython } from "./runtimes/python";
import { detectGo } from "./runtimes/go";
import { detectRust } from "./runtimes/rust";
import { detectJava } from "./runtimes/java";
import { detectRuby } from "./runtimes/ruby";

export type Runtime = "node" | "python" | "go" | "rust" | "java" | "ruby" | "unknown";

export function detectRuntime(cwd = process.cwd()): Runtime {
  const detectors: Array<(cwd: string) => boolean> = [
    detectNode,
    detectPython,
    detectGo,
    detectRust,
    detectJava,
    detectRuby
  ];

  const runtimeNames: Runtime[] = ["node", "python", "go", "rust", "java", "ruby"];

  const runtime = detectors.find(detector => detector(cwd));
if (runtime) {
  const index = detectors.indexOf(runtime);
  return runtimeNames[index] ?? "unknown";
}

  return "unknown";
}