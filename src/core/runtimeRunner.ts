import { exec } from "child_process";
import { Runtime } from "./runtimeDetector";
import fs from "fs";
import path from "path";

export function runRuntime(runtime: Runtime, cwd = process.cwd()): void {
  let command: string | null = null;

  switch (runtime) {
    case "node":
      if (fs.existsSync(path.join(cwd, "package.json"))) {
        command = "npm start";
      } else {
        command = "node index.js";
      }
      break;

    case "python":
      if (fs.existsSync(path.join(cwd, "main.py"))) {
        command = "python main.py";
      }
      break;

    case "go":
      if (fs.existsSync(path.join(cwd, "main.go"))) {
        command = "go run main.go";
      }
      break;

    case "rust":
      if (fs.existsSync(path.join(cwd, "Cargo.toml"))) {
        command = "cargo run";
      }
      break;

    case "java":
      if (fs.existsSync(path.join(cwd, "pom.xml"))) {
        command = "mvn exec:java";
      } else if (fs.existsSync(path.join(cwd, "build.gradle"))) {
        command = "gradle run";
      }
      break;

    case "ruby":
      if (fs.existsSync(path.join(cwd, "main.rb"))) {
        command = "ruby main.rb";
      }
      break;

    default:
      console.error(`[Nili] Unknown runtime: ${runtime}`);
      return;
  }

  if (!command) {
    console.error(`[Nili] No entrypoint found for ${runtime}`);
    return;
  }

  console.log(`[Nili] Running: ${command}`);
  const child = exec(command, { cwd });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
}
