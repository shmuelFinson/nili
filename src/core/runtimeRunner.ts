import { spawn } from "child_process";
import { chooseEntrypoint } from "./utils/entrypoint";
import { getEntrypointsByRole } from "./entrypointDetector";
import inquirer from "inquirer";

/**
 * Runs the detected runtime and selects the appropriate entrypoint(s).
 * Handles multi-role detection (client, server, worker, etc.)
 */
export async function runRuntime(runtime: string, cwd: string) {
  // 🔹 First, handle env override
  const envEntrypoint = process.env.NILI_ENTRYPOINT;
  let entry: string | null = envEntrypoint ?? null;

  // 🔹 Detect all entrypoints grouped by role
  const entrypointsByRole = getEntrypointsByRole(runtime, cwd) ?? {};
  const roles = Object.keys(entrypointsByRole).filter(
  (r) => (entrypointsByRole[r]?.length ?? 0) > 0
);


  let selectedRole: string | null = null;

  // 🎯 If multiple roles exist, let the user choose
  if (roles.length > 1) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Multiple roles detected — which one do you want to run?",
        choices: [...roles, new inquirer.Separator(), "Run all"],
      },
    ]);
    selectedRole = answer.role === "Run all" ? null : answer.role;
  } else if (roles.length === 1) {
    selectedRole = roles[0] ?? null;
  }

  // 🔹 Get entries for the chosen role
  const entries =
    selectedRole && entrypointsByRole[selectedRole]
      ? entrypointsByRole[selectedRole]
      : Object.values(entrypointsByRole).flat();

  if (!entry && entries?.length === 0) {
    console.error(`[Nili] No entrypoints found for runtime: ${runtime}`);
    process.exit(1);
  }

  // 🔹 If user didn’t specify via env, and multiple entries exist, ask
  if (!entry) {
    entry = await chooseEntrypoint(runtime, cwd, entries);
  }

  if (!entry) {
    console.error(`[Nili] No entrypoint selected or found.`);
    process.exit(1);
  }

  // 🔹 Determine runtime command
  let command = "";

  switch (runtime) {
    case "node":
      command = entry.endsWith(".ts") ? `npx ts-node ${entry}` : `node ${entry}`;
      break;
    case "python":
      command = `python3 ${entry}`;
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

  console.log(`[Nili] Running ${selectedRole ?? "project"}: ${command}`);

  // 🔹 Execute the process
  const [cmd, ...args] = command.split(" ");
  if (!cmd) {
    console.error("[Nili] Invalid command");
    process.exit(1);
  }
  const proc = spawn(cmd, args, { cwd, stdio: "inherit" });

  proc.on("exit", (code) => {
    console.log(`[Nili] Process exited with code ${code}`);
    process.exit(code ?? 0);
  });
}
