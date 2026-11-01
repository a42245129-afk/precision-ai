import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const generatedPaths = [
  "packages/core/dist",
  "packages/core/tsconfig.tsbuildinfo",
  "apps/api/dist",
  "apps/api/tsconfig.tsbuildinfo",
  "apps/extension/dist"
];

for (const path of generatedPaths) {
  rmSync(resolve(root, path), { recursive: true, force: true });
}