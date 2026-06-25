interface SocialProofBarProps {
  items: { label: string }[];
}

export function SocialProofBar({ items }: SocialProofBarProps) {
  return (
    <section aria-label="Product highlights" className="border-y border-border bg-paper py-6">
      <div className="container-marketing">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item) => (
            <li key={item.label} className="text-center text-sm font-medium text-muted">
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
