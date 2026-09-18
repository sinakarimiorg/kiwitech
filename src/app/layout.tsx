import type { Metadata } from "next";
import ReduxProvider from "../providers/ReduxProvider";

import { Suspense } from "react";
import NavigationProgress from "../components/modules/NavigationProgress/NavigationProgress";

import "./globals.css";

export const metadata: Metadata = {
  title: "KiwiTech",
  description: "لوازم جانبی موبایل",
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
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
