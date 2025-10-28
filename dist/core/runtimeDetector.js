"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectRuntime = detectRuntime;
const node_1 = require("./runtimes/node");
function detectRuntime(cwd = process.cwd()) {
    const detectors = [
        node_1.detectNode,
        // detectPython,
        // detectGo,
        // detectRust,
        // detectJava,
        // detectRuby
    ];
    const runtimeNames = ["node", "python", "go", "rust", "java", "ruby"];
    const runtime = detectors.find(detector => detector(cwd));
    if (runtime) {
        const index = detectors.indexOf(runtime);
        return runtimeNames[index] ?? "unknown";
    }
    return "unknown";
}
//# sourceMappingURL=runtimeDetector.js.map