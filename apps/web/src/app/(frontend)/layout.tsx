import React from "react";
import type { Metadata } from "next";
import { RootProviders } from "@/libs/providers/root-providers";
import { getServerSideURL } from "@/libs/utils/getURL";
import { mergeOpenGraph } from "@/libs/utils/mergeOpenGraph";
import "@repo/ui/globals.css";
import { AnimatedGridPattern } from "@repo/ui/components/ui/animated-grid";
import "@/styles/global.css";
import { InitTheme } from "@/libs/providers/Theme/InitTheme";
import { Header } from "@/components/Header/Component";
import { Footer } from "@/components/Footer/Component";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <RootProviders>
          <Header />
          {children}
          <Footer />
        </RootProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@powerturtle",
  },
};
