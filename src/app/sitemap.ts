import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PUBLIC_PATHS = [
  "",
  "/pto-calculator",
  "/pto-accrual-calculator",
  "/pto-payout-calculator",
  "/how-to-calculate-pto",
  "/how-does-pto-accrual-work",
  "/pto-hours-to-days",
  "/pto-payout",
  "/pto-accrual",
  "/pto-tracker",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.includes("accrual-calculator") ? 0.9 : 0.7,
  }));
}
