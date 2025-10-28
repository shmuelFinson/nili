import fs from "fs";
import path from "path";

export function detectGo(cwd: string): boolean {
  const markers = ["go.mod"];
  console.log(`[checking for go] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".go"));
}
