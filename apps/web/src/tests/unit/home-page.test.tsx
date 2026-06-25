import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/(marketing)/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("HomePage", () => {
  it("renders hero headline and waitlist form", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /your lab history, finally in one timeline/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", { name: /join the waitlist/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/upload pdfs from any lab/i)).toBeInTheDocument();
  });
});
