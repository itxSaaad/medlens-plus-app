"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pushEvent, getPageTypeFromPath } from "@/lib/analytics/data-layer";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  ctaLabel?: string;
  privacyNote?: string;
  className?: string;
  id?: string;
}

export function WaitlistForm({
  ctaLabel = "Join the waitlist",
  privacyNote = "We use your email only for early access updates.",
  className,
  id = "waitlist",
}: WaitlistFormProps) {
  const pathname = usePathname();
  const pageType = getPageTypeFromPath(pathname);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage("Please agree to receive early access updates.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setMessage("You are on the list. We will email you when early access opens.");
      setEmail("");
      pushEvent({ event: "waitlist_submit", page_type: pageType, success: true });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      pushEvent({ event: "waitlist_submit", page_type: pageType, success: false });
    }
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={cn("w-full max-w-md space-y-4", className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            aria-describedby={`${id}-privacy ${id}-status`}
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="shrink-0"
          >
            {status === "loading" ? "Joining…" : ctaLabel}
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          id={`${id}-consent`}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-4 rounded border-border text-lens focus:ring-lens"
          required
        />
        <Label htmlFor={`${id}-consent`} className="text-xs leading-relaxed text-muted">
          I agree to receive early access updates. See our{" "}
          <Link href="/privacy" className="text-lens underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>
      </div>

      <p id={`${id}-privacy`} className="text-xs text-muted">
        {privacyNote}
      </p>

      {message && (
        <p
          id={`${id}-status`}
          role="status"
          className={cn(
            "text-sm",
            status === "success"
              ? "text-success"
              : status === "error"
                ? "text-destructive"
                : "text-muted",
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
