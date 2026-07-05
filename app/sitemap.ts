import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/inventory";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getVehicles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: siteUrl("/inventory"), changeFrequency: "daily", priority: 0.9 },
    { url: siteUrl("/financing"), changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/trade-in"), changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.4 },
    { url: siteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const vehiclePages: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: siteUrl(`/inventory/${v.slug}`),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...vehiclePages];
}
