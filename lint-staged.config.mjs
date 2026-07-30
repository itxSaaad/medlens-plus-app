// .claude/skills/*/references/** are vendored third-party skill bundles
// (e.g. react-best-practices, test-master) — not house-style content.
const IGNORED_PATH_RE =
  /(?:^|\/)(graphify-out|\.cursor|\.claude\/skills\/graphify|\.claude\/skills\/[^/]+\/references)(?:\/|$)/;

/** @param {string[]} files */
function withoutIgnoredPaths(files) {
  return files.filter((file) => !IGNORED_PATH_RE.test(file.replace(/\\/g, "/")));
}

/** @param {string[]} files */
function quoted(files) {
  // Escape backslashes before quotes, or a path ending in `\` immediately
  // followed by our closing `"` would escape the quote itself instead of
  // being treated as a literal backslash — CodeQL: incomplete string escaping.
  return files.map((file) => `"${file.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(" ");
}

/** @param {string[]} files @param {string} command */
function runOnFiles(files, command) {
  const filtered = withoutIgnoredPaths(files);
  if (filtered.length === 0) {
    return [];
  }
  return [`${command} ${quoted(filtered)}`];
}

/** @type {import('lint-staged').Configuration} */
export default {
  "*.{js,jsx,ts,tsx,mjs,cjs,json,yml,yaml,css}": (files) =>
    runOnFiles(files, "prettier --write --ignore-unknown"),
  "*.md": (files) => runOnFiles(files, "markdownlint --fix"),
  "apps/web/**/*.{js,jsx,ts,tsx,mjs}": (files) =>
    runOnFiles(files, "pnpm --filter @medlens/web exec eslint --fix"),
  "apps/mobile/**/*.{js,jsx,ts,tsx,mjs,cjs,json}": (files) =>
    runOnFiles(files, "pnpm --filter @medlens/mobile exec eslint --fix"),
  "apps/api/**/*.py": (files) => runOnFiles(files, "uv run --directory apps/api ruff check --fix"),
};
