#!/usr/bin/env node
// Syncs apps/api Python dev deps (mypy, ruff, pytest) on `pnpm install`, mirroring CI's
// `uv sync --directory apps/api --frozen --group dev`. Uses spawnSync with no shell so
// behavior is identical on Windows, Linux, and macOS.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const apiDir = path.join(repoRoot, "apps", "api");

const uvCheck = spawnSync("uv", ["--version"], { stdio: "ignore" });

if (uvCheck.error || uvCheck.status !== 0) {
  console.warn(
    "\n[sync-python-deps] `uv` not found on PATH — skipping Python dev dep sync (apps/api).",
  );
  console.warn("  Install uv:");
  console.warn("    macOS/Linux: curl -LsSf https://astral.sh/uv/install.sh | sh");
  console.warn(
    '    Windows:     powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
  );
  console.warn("  Then re-run `pnpm install` to sync apps/api Python deps.\n");
  process.exit(0);
}

const sync = spawnSync("uv", ["sync", "--directory", apiDir, "--frozen", "--group", "dev"], {
  stdio: "inherit",
});

if (sync.status !== 0) {
  console.error("[sync-python-deps] `uv sync` failed for apps/api.");
  process.exit(1);
}
