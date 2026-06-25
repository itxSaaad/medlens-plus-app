"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./waitlist-form";
import { pushEvent, getPageTypeFromPath } from "@/lib/analytics/data-layer";
import { usePathname } from "next/navigation";

interface WaitlistSheetProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export function WaitlistSheet({
  triggerLabel = "Join waitlist",
  triggerClassName,
}: WaitlistSheetProps) {
  const pathname = usePathname();

  function handleOpen() {
    pushEvent({
      event: "cta_click",
      cta_id: "header_waitlist_sheet",
      page_type: getPageTypeFromPath(pathname),
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={triggerClassName} onClick={handleOpen}>
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Join the early access waitlist</SheetTitle>
        </SheetHeader>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll email you when a spot opens. No spam, and we won&apos;t sell your address.
        </p>
        <div className="mt-6">
          <WaitlistForm id="sheet-waitlist" ctaLabel="Join the waitlist" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
