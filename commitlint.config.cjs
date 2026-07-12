module.exports = {
  extends: ["@commitlint/config-conventional"],
  // Dependabot's auto-generated commit body includes a compare-URL line that
  // routinely exceeds body-max-line-length; the subject itself is already a
  // valid conventional commit, and the trailer is genuinely bot-generated
  // (not attacker-controlled without existing write access).
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};
