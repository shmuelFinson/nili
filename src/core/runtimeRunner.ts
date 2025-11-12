import { spawn } from "child_process";
import { chooseEntrypoint } from "./utils/entrypoint";
import { getEntrypointsByRole } from "./entrypointDetector";
import inquirer from "inquirer";
import { NiliConfig } from "./utils/config";
import getPort from "get-port";

export async function promptForRoles(roles: string[]): Promise<string[]> {
  const { selectedRoles } = await inquirer.prompt<{ selectedRoles: string[] }>([
    {
      type: "checkbox",
      name: "selectedRoles",
      message: "Multiple roles detected — select which ones to run:",
      choices: [
        ...roles.map((r) => ({ name: r, value: r })),
        new inquirer.Separator(),
        { name: "Run all", value: "__ALL__" },
      ],
      validate: (ans: unknown) =>
        Array.isArray(ans) && ans.length > 0
          ? true
          : "Select at least one role to run.",
    },
  ]);

  return selectedRoles.includes("__ALL__") ? roles : selectedRoles;
}
/**
 * Runs the detected runtime and selects the appropriate entrypoint(s).
 * Handles multi-role detection (client, server, worker, etc.)
 */
export async function runRuntimeWithConfig(config: NiliConfig, cwd: string) {
  if (!config.roles) {
    console.error("[Nili] Config has no roles defined.");
    process.exit(1);
  }

  const roles = Object.keys(config.roles);
  let selectedRole: string | null = null;

  if (roles.length > 1) {
    const selectedRoles = await promptForRoles(roles);
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

  const rolesToRun = selectedRole === null ? roles : [selectedRole];

  // 🔹 Assign ports dynamically if missing
  await Promise.all(
    rolesToRun.map(async (role) => {
      const roleConfig = config.roles?.[role];
      if (!roleConfig) return; // skip invalid roles
      if (!roleConfig.port) {
        roleConfig.port = await getPort();
      }
    })
  );

  console.log(`[Nili] Starting ${rolesToRun.length} role(s) in parallel...\n`);

  const processes = rolesToRun
    .map((role) => {
      const roleConfig = config.roles[role];
      if (!roleConfig?.entry) {
        console.error(`[Nili] No entry defined for role: ${role}`);
        return null;
      }

      const command = roleConfig.runner
        ? `${roleConfig.runner} ${roleConfig.entry}`
        : getDefaultCommand(roleConfig.runtime ?? "node", roleConfig.entry);

      console.log(
        `[Nili] Running ${role}: ${command} (port ${roleConfig.port})`
      );

      const [cmd, ...args] = command.split(" ");
      if (!cmd) {
        console.error("[Nili] Invalid command");
        process.exit(1);
      }

      const proc = spawn(cmd, args, {
        cwd,
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: roleConfig.port?.toString() ?? "",
          ROLE: role,
        },
      });

      proc.on("exit", (code) => {
        console.log(`[Nili] Process for ${role} exited with code ${code}`);
      });

      return proc;
    })
    .filter(Boolean);

  // 🔹 Wait for all to exit before closing parent
  await Promise.all(
    processes.map(
      (p) => new Promise<void>((resolve) => p!.on("exit", () => resolve()))
    )
  );

  console.log("[Nili] All roles have exited.");
}

/** Default command per runtime */
function getDefaultCommand(runtime: string, entry: string) {
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

/**
 * Fallback runtime handler — runs without config (auto-detects entrypoints)
 * Supports multiple entrypoints and dynamic port assignment
 */
export async function runRuntime(runtime: string, cwd: string) {
  const envEntrypoint = process.env.NILI_ENTRYPOINT;
  let entry: string | null = envEntrypoint ?? null;

  const entrypointsByRole = getEntrypointsByRole(runtime, cwd) ?? {};
  const roles = Object.keys(entrypointsByRole);

  let selectedRoles: string[] = [];

  // 🔹 Step 1: Choose roles (allow multi-select)
  if (roles.length > 1) {
    selectedRoles = await promptForRoles(roles);
  } else if (roles.length === 1) {
    selectedRoles = [roles[0] ?? ""];
  }

  // Step 2: Gather entrypoints for chosen roles
  const rolesToRun = selectedRoles;
  let entriesToRun: string[] = [];

  for (const role of rolesToRun) {
    const entries = entrypointsByRole[role] ?? [];
    if (entries.length === 0) continue;

    let chosenEntries: string[] = [];

    if (entry) {
      chosenEntries = entries.filter((e) => e === entry);
    } else if (entries.length === 1) {
      chosenEntries = [entries[0] ?? ""];
    } else {
      // Prompt user for which entries to run for this role
      const chosen = await chooseEntrypoint(runtime, cwd, entries);
      if (chosen) chosenEntries = [chosen];
    }

    entriesToRun.push(...chosenEntries);
  }

  if (entriesToRun.length === 0) {
    console.error(`[Nili] No entrypoints found to run.`);
    process.exit(1);
  }

  // Step 3–5 remain unchanged
  const entryPorts = await Promise.all(
    entriesToRun.map(async (_, i) => {
      const envPort = process.env[`PORT_${i}`] || process.env.PORT;
      return envPort ? Number(envPort) : await getPort();
    })
  );

  console.log(
    `[Nili] Running ${entriesToRun.length} entrypoint(s) in parallel...\n`
  );

  const processes = entriesToRun.map((entryPoint, idx) => {
    const port = entryPorts[idx];
    const command = getDefaultCommand(runtime, entryPoint);

    console.log(`[Nili] Running ${entryPoint}: ${command} (port ${port})`);

    const [cmd, ...args] = command.split(" ");
    if (!cmd) {
      console.error("[Nili] Invalid command");
      process.exit(1);
    }

    const proc = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: port?.toString(),
        ENTRYPOINT: entryPoint,
      },
    });

    proc.on("exit", (code) => {
      console.log(`[Nili] Process for ${entryPoint} exited with code ${code}`);
    });

    return proc;
  });

  await Promise.all(
    processes.map(
      (p) => new Promise<void>((resolve) => p.on("exit", () => resolve()))
    )
  );

  console.log("[Nili] All entrypoints have exited.");
}
