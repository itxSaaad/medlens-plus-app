import Link from "next/link";
import { Shield } from "lucide-react";

interface TrustSafetyBlockProps {
  title: string;
  description: string;
  items: string[];
}

export function TrustSafetyBlock({ title, description, items }: TrustSafetyBlockProps) {
  return (
    <section aria-labelledby="trust-heading" className="section-padding">
      <div className="container-marketing rounded-2xl border border-border bg-paper p-8 md:p-12">
        <div className="flex items-start gap-4">
          <Shield className="size-8 shrink-0 text-lens" aria-hidden="true" />
          <div>
            <h2 id="trust-heading">{title}</h2>
            <p className="prose-narrow mt-4">{description}</p>
            <ul className="mt-6 space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lens"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <Link href="/security" className="font-medium text-lens hover:underline">
                Read our security practices →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
