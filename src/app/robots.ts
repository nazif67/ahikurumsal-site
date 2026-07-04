import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ahikurumsal.com/sitemap.xml",
    host: "https://ahikurumsal.com",
  };
}
