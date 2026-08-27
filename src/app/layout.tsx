import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PTO Tracker — Know exactly how much PTO you have",
    template: "%s | PTO Tracker",
  },
  description:
    "Calculate your PTO, see how quickly it accrues, and know exactly how much time off you'll have before your next trip.",
  openGraph: {
    type: "website",
    siteName: "PTO Tracker",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "ChCHVUHqSYYmFSAzSR8YH7Irlsglw7GOHkatYRB2lz4",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
