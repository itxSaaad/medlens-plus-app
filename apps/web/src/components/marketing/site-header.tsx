"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import type { SiteConfig } from "@medlens/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "./logo-wordmark";
import { WaitlistSheet } from "./waitlist-sheet";

interface SiteHeaderProps {
  site: SiteConfig;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lens focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="container-marketing flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <LogoWordmark />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-lens",
                pathname === link.href ? "text-lens" : "text-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WaitlistSheet />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{site.name}</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-4">
              {site.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-ink hover:text-lens"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4">
                <WaitlistSheet triggerClassName="w-full" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
