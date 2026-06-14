const IGNORED_PATH_RE = /(?:^|\/)(graphify-out|\.cursor|\.claude\/skills\/graphify)(?:\/|$)/;

/** @param {string[]} files */
function withoutIgnoredPaths(files) {
  return files.filter((file) => !IGNORED_PATH_RE.test(file.replace(/\\/g, "/")));
}

/** @param {string[]} files */
function quoted(files) {
  return files.map((file) => `"${file.replace(/"/g, '\\"')}"`).join(" ");
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
  "apps/api/**/*.py": (files) => runOnFiles(files, "uv run --directory apps/api ruff check --fix"),
};
