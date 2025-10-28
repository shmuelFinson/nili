import fs from "fs";
import path from "path";

export function detectRuby(cwd: string): boolean {
  const markers = ["Gemfile"];
    console.log(`[checking for ruby] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".rb"));
}
