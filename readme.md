NILI - The Intelligent Local Runtime Detector and Runner

Description:
Nili automatically detects your project's runtime (Node.js, Python, Ruby, Go, Rust, Java)
and runs it locally. It supports multi-role projects (server, client, worker) with multiple entrypoints.

Features:
- Detects runtime automatically
- Handles multiple roles and entrypoints
- Prompts for entrypoint selection if multiple scripts exist
- Environment variable override: NILI_ENTRYPOINT
- Executes scripts with the correct runtime command

Installation:
1. Clone the repository:
   git clone https://github.com/shmuelFinson/nili.git
2. Install dependencies:
   npm install
3. Build the project:
   npm run build

Usage:
- Run your project:
   nili run
- Only detect the runtime:
   nili detect
- Specify an entrypoint manually:
   NILI_ENTRYPOINT=server.js nili run

Supported Runtimes:
- Node.js (.js, .ts)
- Python (.py)
- Ruby (.rb)
- Go (.go)
- Rust (cargo run)
- Java (.java)

License:
MIT
