import fs from "fs";
import path from "path";

export function detectRust(cwd: string): boolean {
  const markers = ["Cargo.toml"];
    console.log(`[checking for rust] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".rs"));
}
