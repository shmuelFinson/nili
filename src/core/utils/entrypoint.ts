import fs from "fs";
import path from "path";
import inquirer from "inquirer"; // for CLI prompts

const candidates: Record<string, string[]> = {
  node: ["index.js", "app.js", "server.js", "index.ts", "app.ts", "server.ts"],
  python: ["main.py", "app.py"],
  go: ["main.go"],
  rust: [], // cargo run handles main.rs automatically
  java: ["Main.java"],
  ruby: ["main.rb", "app.rb"],
};

export function getEntrypoints(runtime: string, cwd: string): string[] {
  const files: string[] = [];

  // check root and optionally src/
  const searchDirs = ["", "src"];

  for (const dir of searchDirs) {
    for (const candidate of candidates[runtime] || []) {
      const fullPath = path.join(cwd, dir, candidate);
      if (fs.existsSync(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export async function chooseEntrypoint(
  runtime: string,
  cwd: string,
  entries?: string[]
): Promise<string | null> {
  // If entries weren’t passed, discover them
  const resolvedEntries = entries ?? getEntrypoints(runtime, cwd);

  if (resolvedEntries.length === 0) {
    return null;
  }

  if (resolvedEntries.length === 1) {
    return resolvedEntries[0] ?? null;
  }

  // Multiple candidates → prompt user
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "entry",
      message: `Multiple entrypoints found for ${runtime}, choose one to run:`,
      choices: resolvedEntries,
    },
  ]);

  return answer.entry;
}
