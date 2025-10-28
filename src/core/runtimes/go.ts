import fs from "fs";
import path from "path";

export function detectGo(cwd: string): boolean {
  const markers = ["go.mod"];
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".go"));
}