import Link from "next/link";
import { getBrandName } from "@/lib/site/env";
import { Logo } from "./logo";

interface LogoWordmarkProps {
  href?: string;
  className?: string;
  iconClassName?: string;
}

export function LogoWordmark({
  href = "/",
  className = "flex items-center gap-2 text-ink",
  iconClassName = "size-8 text-lens",
}: LogoWordmarkProps) {
  const brand = getBrandName();

  return (
    <Link href={href} className={className} aria-label={`${brand} home`}>
      <Logo className={iconClassName} />
      <span className="font-sans text-lg font-semibold tracking-tight">{brand}</span>
    </Link>
  );
}
