import { MetadataRoute } from "next";

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private", "/admin"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/private", "/admin"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/private", "/admin"],
      },
    ],
    sitemap: "https://blazingautomations.com/sitemap.xml",
    host: "https://blazingautomations.com",
  };
}

export default robots;
