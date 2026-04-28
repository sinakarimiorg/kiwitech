import type { Metadata } from "next";
import ReduxProvider from "../providers/ReduxProvider";

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
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
