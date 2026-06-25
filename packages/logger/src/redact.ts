const PHI_DENYLIST = new Set([
  "patient_id",
  "report_text",
  "lab_value",
  "email",
  "file_name",
  "diagnosis",
  "report_content",
]);

export function redactContext(
  context: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!context) {
    return undefined;
  }

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    if (PHI_DENYLIST.has(key.toLowerCase())) {
      redacted[key] = "[REDACTED]";
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      redacted[key] = redactContext(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}
