import Link from "next/link";

interface ContentCardProps {
  href: string;
  title: string;
  description: string;
  meta?: string;
  featured?: boolean;
}

export function ContentCard({ href, title, description, meta, featured }: ContentCardProps) {
  return (
    <article
      className={
        featured
          ? "flex h-full flex-col rounded-2xl border border-lens/30 bg-paper p-8 shadow-sm ring-1 ring-lens/10 md:col-span-2"
          : "flex h-full flex-col rounded-xl border border-border bg-paper p-6 transition-shadow hover:shadow-md"
      }
    >
      {meta && <p className="text-xs font-medium uppercase tracking-wide text-lens">{meta}</p>}
      <h2 className={`font-display hover:text-lens ${featured ? "mt-3 text-2xl" : "mt-2 text-xl"}`}>
        <Link href={href}>{title}</Link>
      </h2>
      <p className="mt-3 flex-1 text-sm text-muted">{description}</p>
      <Link href={href} className="mt-4 text-sm font-medium text-lens hover:underline">
        Read more →
      </Link>
    </article>
  );
}
