import fs from "fs";
import path from "path";

export function detectJava(cwd: string): boolean {
  const markers = ["pom.xml", "build.gradle"];
    console.log(`[checking for java] scanning files in ${cwd}`);
  for (const file of markers) {
    if (fs.existsSync(path.join(cwd, file))) return true;
  }

  const files = fs.readdirSync(cwd);
  return files.some((f) => f.endsWith(".java"));
}
