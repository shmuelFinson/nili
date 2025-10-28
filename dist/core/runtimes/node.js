"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectNode = detectNode;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function detectNode(cwd) {
    const markers = ["package.json"];
    console.log(`[checking for node] scanning files in ${cwd}`);
    for (const file of markers) {
        if (fs_1.default.existsSync(path_1.default.join(cwd, file)))
            return true;
    }
    // fallback: check for .js files
    const files = fs_1.default.readdirSync(cwd);
    return files.some(f => f.endsWith(".js"));
}
//# sourceMappingURL=node.js.map