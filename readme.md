Nili

The intelligent local runtime detector and runner

Nili automatically detects the runtime of your project (Node.js, Python, Ruby, Go, Rust, Java) and runs it locally. It supports multi-role projects with multiple entrypoints, letting you choose which script to run.

Features

Detects runtime automatically

Supports multi-role projects: server, client, worker, etc.

Prompts for entrypoint selection when multiple files exist

Environment variable override via NILI_ENTRYPOINT

Runs scripts using the correct runtime command

Installation
git clone https://github.com/shmuelFinson/nili.git
cd nili
npm install
npm run build

Usage
nili run        # Detect runtime and run your project
nili detect     # Only detect runtime without running


To specify an entrypoint manually:

NILI_ENTRYPOINT=server.js nili run

Supported Runtimes

Node.js (.js, .ts)

Python (.py)

Ruby (.rb)

Go (.go)

Rust (cargo run)

Java (.java)