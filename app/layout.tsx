import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@shopify/polaris/build/esm/styles.css";
import "./globals.css";
import { ShopifyAppProviders } from "@/components/ShopifyAppProviders";

export const metadata: Metadata = {
  title: "Free Ship",
  description: "Free shipping progress bar app for Shopify stores"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopifyAppProviders>{children}</ShopifyAppProviders>
      </body>
    </html>
  );
}
