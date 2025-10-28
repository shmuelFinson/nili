import fs from "fs";
import path from "path";

export function detectPython(cwd: string): boolean {
  const markers = ["requirements.txt", "pyproject.toml"];
  console.log(`[checking for python] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some(f => f.endsWith(".py"));
}