import { cn } from "@/lib/utils";

export function MeshGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute -left-1/4 top-0 size-[480px] rounded-full blur-3xl"
        style={{
          backgroundColor: `color-mix(in srgb, var(--lens) calc(var(--bg-mesh-opacity) * 100%), transparent)`,
        }}
      />
      <div
        className="absolute -right-1/4 top-1/3 size-[400px] rounded-full blur-3xl"
        style={{
          backgroundColor: `color-mix(in srgb, var(--insight) calc(var(--bg-mesh-insight-opacity) * 100%), transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 size-[320px] rounded-full blur-3xl"
        style={{
          backgroundColor: `color-mix(in srgb, var(--lens) calc(var(--bg-mesh-opacity) * 100%), transparent)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--surface)_100%)] opacity-60" />
    </div>
  );
}
