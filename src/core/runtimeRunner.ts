import { spawn } from "child_process";
import { chooseEntrypoint } from "./utils/entrypoint";

export async function runRuntime(runtime: string, cwd: string) {
  // Check for environment override
  const envEntrypoint = process.env.NILI_ENTRYPOINT;
  let entry: string | null = envEntrypoint ?? null;

  if (!entry) {
    entry = await chooseEntrypoint(runtime, cwd);
  }

  if (!entry) {
    console.error(`[Nili] No entrypoint found for runtime: ${runtime}`);
    process.exit(1);
  }

  let command = "";

  switch (runtime) {
    case "node":
      command = entry.endsWith(".ts") ? `ts-node ${entry}` : `node ${entry}`;
      break;
    case "python":
      command = `python ${entry}`;
      break;
    case "ruby":
      command = `ruby ${entry}`;
      break;
    case "go":
      command = `go run ${entry}`;
      break;
    case "rust":
      command = `cargo run`;
      break;
    case "java":
      command = `java ${entry}`;
      break;
    default:
      console.error(`[Nili] Unsupported runtime: ${runtime}`);
      process.exit(1);
  }

  const [cmd, ...args] = command.split(" ");
  if (!cmd) {
    console.error("[Nili] Invalid command");
    process.exit(1);
  }
  const proc = spawn(cmd, args, { cwd, stdio: "inherit" });

  proc.on("exit", (code) => process.exit(code ?? 0));
}
