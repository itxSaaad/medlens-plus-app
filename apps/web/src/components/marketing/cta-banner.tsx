import { WaitlistForm } from "./waitlist-form";

interface CtaBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
}

export function CtaBanner({ title, description, ctaLabel }: CtaBannerProps) {
  return (
    <section aria-labelledby="cta-heading" className="section-padding">
      <div className="container-marketing rounded-2xl bg-ink px-8 py-12 text-center text-white md:px-16">
        <h2 id="cta-heading" className="text-white">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">{description}</p>
        <div className="mx-auto mt-8 flex justify-center">
          <WaitlistForm
            ctaLabel={ctaLabel}
            privacyNote="Early access updates only. Unsubscribe anytime."
            id="final-waitlist"
          />
        </div>
      </div>
    </section>
  );
}
