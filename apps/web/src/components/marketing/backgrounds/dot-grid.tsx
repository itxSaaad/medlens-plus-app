import { cn } from "@/lib/utils";

export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_#64748b_1px,_transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(to_bottom,black_70%,transparent)]",
        className,
      )}
      style={{ opacity: "var(--bg-grid-opacity)" }}
    />
  );
}
