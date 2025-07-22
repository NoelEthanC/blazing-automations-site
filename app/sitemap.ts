import { MetadataRoute } from "next";

function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://blazingautomations.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}

export default sitemap;
