import fs from "fs";
import path from "path";

export function detectNode(cwd: string): boolean {
  const markers = ["package.json"];
  console.log(`[checking for node] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  // fallback: check for .js files
  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".js"));
}
