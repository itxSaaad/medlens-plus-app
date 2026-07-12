module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Commit bodies routinely contain unwrappable URLs (Dependabot changelog
    // links, GitHub compare URLs). An ignores-predicate approach was tried
    // first but proved unreliable -- depends on exactly how the commitlint
    // GitHub Action passes each commit message internally, and kept failing
    // even for commits that clearly matched the predicate. Disabling the
    // rule outright is simpler and actually reliable.
    "body-max-line-length": [0],
  },
};
