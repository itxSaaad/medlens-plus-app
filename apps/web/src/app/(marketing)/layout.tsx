import { getSiteConfig } from "@/lib/content/loader";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ConsentBanner, GtmScript } from "@/components/marketing/analytics-provider";
import { PageViewTracker } from "@/components/marketing/page-view-tracker";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteConfig();

  return (
    <>
      <SiteHeader site={site} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter site={site} />
      <ConsentBanner />
      <GtmScript />
      <PageViewTracker />
    </>
  );
}
