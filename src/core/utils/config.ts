import fs from "fs";
import path from "path";
import { cwd } from "process";

export interface RoleConfig {
  entry: string;
  runtime?: string;
  runner?: string;
}

export interface NiliConfig {
  roles: Record<string, RoleConfig>;
}

export function loadConfig(cwd: string): NiliConfig | null {
  const fullPath = path.join(cwd, "nili.config.json");
  if (fs.existsSync(fullPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(fullPath, "utf8")) as NiliConfig;
      return raw;
    } catch (err) {
      console.error(`[Nili] Failed to parse config: ${fullPath}`, err);
      return null;
    }
  }

  return null;
}
