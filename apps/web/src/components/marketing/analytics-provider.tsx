"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  CONSENT_STORAGE_KEY,
  getConsentState,
  grantAnalyticsConsent,
  initConsentDefaults,
  setConsentState,
  type ConsentState,
} from "@/lib/analytics/consent";
import { Button } from "@/components/ui/button";

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("medlens-consent-change", onStoreChange);
  return () => window.removeEventListener("medlens-consent-change", onStoreChange);
}

function getClientSnapshot(): ConsentState {
  initConsentDefaults();
  return getConsentState();
}

function getServerSnapshot(): ConsentState {
  return "pending";
}

export function ConsentBanner() {
  const consent = useSyncExternalStore(subscribeToConsent, getClientSnapshot, getServerSnapshot);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient || consent !== "pending") {
    return null;
  }

  function accept() {
    setConsentState("granted");
    grantAnalyticsConsent();
  }

  function decline() {
    setConsentState("denied");
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-paper p-4 shadow-lg sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <p className="text-sm text-muted">
        We use analytics cookies to understand how visitors use our site. No health data or PHI is
        collected. See our{" "}
        <Link href="/privacy" className="text-lens underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" onClick={accept}>
          Accept analytics
        </Button>
        <Button size="sm" variant="outline" onClick={decline}>
          Decline
        </Button>
      </div>
    </div>
  );
}

export function GtmScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const enabled = useSyncExternalStore(
    subscribeToConsent,
    () => localStorage.getItem(CONSENT_STORAGE_KEY) === "granted",
    () => false,
  );

  if (!gtmId || !enabled) {
    return null;
  }

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
