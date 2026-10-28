import type { Metadata, Viewport } from "next";
import ReduxProvider from "../providers/ReduxProvider";

import { Suspense } from "react";
import NavigationProgress from "../components/modules/NavigationProgress/NavigationProgress";

import JsonLd from "../components/modules/JsonLd/JsonLd";
import { abs, DEFAULT_OG_IMAGE, getSiteUrl, SITE_NAME } from "../lib/seo";

import "./globals.css";

const siteUrl = getSiteUrl()

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "کیوی‌تک | فروشگاه لوازم جانبی موبایل",
    template: "%s | کیوی‌تک",
  },
  description: "خرید آنلاین لوازم جانبی موبایل شامل کاور، شارژر، هدفون و گلس با ضمانت اصالت و ارسال سریع.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
};

type LayoutPropsType = Readonly<{
  children: React.ReactNode;
}>

export default function RootLayout({
  children,
}: LayoutPropsType) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", name: SITE_NAME, url: siteUrl || undefined, logo: abs(DEFAULT_OG_IMAGE) },
              { "@type": "WebSite", name: SITE_NAME, url: siteUrl || undefined, inLanguage: "fa-IR" },
            ],
          }}
        />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
