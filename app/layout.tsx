import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Ship Shopify App",
  description: "Starter Shopify app built with Next.js and PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
