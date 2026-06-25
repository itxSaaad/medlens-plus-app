import { describe, expect, it } from "vitest";
import { redactContext } from "./redact";

describe("redactContext", () => {
  it("redacts PHI keys", () => {
    const result = redactContext({
      email: "user@example.com",
      page: "home",
      nested: { lab_value: 120 },
    });

    expect(result).toEqual({
      email: "[REDACTED]",
      page: "home",
      nested: { lab_value: "[REDACTED]" },
    });
  });
});
