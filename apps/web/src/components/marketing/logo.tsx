import Image from "next/image";
import { BRAND_LOGO_SRC } from "./brand/logo-paths";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt=""
      width={96}
      height={96}
      className={cn("size-8", className)}
      aria-hidden="true"
      priority
    />
  );
}
