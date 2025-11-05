import fs from "fs";
import path from "path";

export interface RoleConfig {
  entry: string;
  runtime?: string | undefined;
  runner?: string | undefined;
}

export type NiliConfig = {
  runtime?: string;
  runner?: string;
  roles?: Record<string, string | RoleConfig>;
  defaultRole?: string;
};

export function loadConfig(cwd: string): {
  config: NiliConfig | null;
  normalizedRoles: Record<string, RoleConfig>;
} {
  const candidates = [".nili.json", "nili.config.json"];
  for (const filename of candidates) {
    const fullPath = path.join(cwd, filename);
    if (fs.existsSync(fullPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(fullPath, "utf8")) as NiliConfig;
        const normalizedRoles = Object.fromEntries(
          Object.entries(raw.roles ?? {}).map(([role, v]) => [
            role,
            typeof v === "string"
              ? { entry: v }
              : {
                  entry: v.entry,
                  runtime: v.runtime,
                  runner: v.runner,
                },
          ])
        );
        return { config: raw, normalizedRoles };
      } catch (err) {
        console.error(`[Nili] Failed to parse config: ${fullPath}`, err);
        return { config: null, normalizedRoles: {} };
      }
    }
  }

  return { config: null, normalizedRoles: {} };
}
