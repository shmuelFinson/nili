import fs from "fs";
import path from "path";

const roleCandidates: Record<string, Record<string, string[]>> = {
  node: {
    server: ["server.js", "server.ts", "app.js", "app.ts"],
    client: ["client.js", "client.ts", "index.js", "index.ts"],
    worker: ["worker.js", "worker.ts"],
  },
  python: {
    server: ["server.py", "app.py"],
    client: ["client.py"],
  },
  go: {
    server: ["main.go"],
  },
  rust: {
    server: ["src/main.rs"],
  },
  java: {
    server: ["Main.java", "App.java"],
  },
  ruby: {
    server: ["server.rb", "app.rb"],
    client: ["client.rb"],
  },
};

export function getEntrypointsByRole(
  runtime: string,
  cwd: string,
  role?: string
): Record<string, string[]> {
  const roles = role ? [role] : Object.keys(roleCandidates[runtime] || {});

  return Object.fromEntries(
    roles.map((r) => [
      r,
      (roleCandidates[runtime]?.[r] || [])
        .map((file) => path.join(cwd, file))
        .filter((filePath) => fs.existsSync(filePath)),
    ])
  );
}
