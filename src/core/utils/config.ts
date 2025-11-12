import path from "path";
import { z } from "zod";
import fs from "fs";

const RoleConfigSchema = z.object({
  entry: z.string(),
  runtime: z.string().optional(),
  runner: z.string().optional(),
  port: z.number().optional(),
});

const NiliConfigSchema = z.object({
  roles: z.record(z.string(), RoleConfigSchema),
});

export type RoleConfig = z.infer<typeof RoleConfigSchema>;
export type NiliConfig = z.infer<typeof NiliConfigSchema>;

export function loadConfig(cwd: string): NiliConfig | null {
  const fullPath = path.join(cwd, "nili.config.json");
  if (fs.existsSync(fullPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      return NiliConfigSchema.parse(raw); // runtime validation
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("[Nili] Invalid nili.config.json:", err.issues);
      } else {
        console.error("[Nili] Failed to load config:", err);
      }
      process.exit(1);
    }
  }
  return null;
}

/** Default command per runtime */
export function getDefaultCommand(runtime: string, entry: string) {
  switch (runtime) {
    case "node":
      return entry.endsWith(".ts") ? `npx ts-node ${entry}` : `node ${entry}`;
    case "python":
      return `python3 ${entry}`;
    case "ruby":
      return `ruby ${entry}`;
    case "go":
      return `go run ${entry}`;
    case "rust":
      return `cargo run`;
    case "java":
      return `java ${entry}`;
    default:
      console.error(`[Nili] Unsupported runtime: ${runtime}`);
      process.exit(1);
  }
}
