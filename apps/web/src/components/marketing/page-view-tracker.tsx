"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getPageTypeFromPath, pushEvent } from "@/lib/analytics/data-layer";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushEvent({ event: "page_view", page_type: getPageTypeFromPath(pathname) });
  }, [pathname]);

  return null;
}
