import { MetadataRoute } from "next";
import { getPublishedResources } from "./actions/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://blazingautomations.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://blazingautomations.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://blazingautomations.com/services",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://blazingautomations.com/resources",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://blazingautomations.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic resources from Prisma
  const resources = await getPublishedResources();

  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `https://blazingautomations.com/resources/${resource.slug}`,
    lastModified: resource.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...resourcePages];
}
