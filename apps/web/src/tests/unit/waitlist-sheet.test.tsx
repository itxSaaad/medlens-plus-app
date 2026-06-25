import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/marketing/site-header";
import { getSiteConfig } from "@/lib/content/loader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/features",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("WaitlistSheet", () => {
  it("opens from header on a non-home route", () => {
    const site = getSiteConfig();

    render(<SiteHeader site={site} />);

    const triggers = screen.getAllByRole("button", { name: /join waitlist/i });
    fireEvent.click(triggers[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/early access waitlist/i)).toBeInTheDocument();
  });
});
