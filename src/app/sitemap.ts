import { MetadataRoute } from "next";
import { strapiGetAll } from "@/lib/strapi";

const BASE_URL = "https://ahikurumsal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/duyurular`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/haberler`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/hazir-sablonlar`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/araclar`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/sss`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/hakkimda`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/iletisim`, priority: 0.5, changeFrequency: "yearly" },
  ];

  type WithSlug = { slug: string; updatedAt?: string };

  const [blogs, duyurular, haberler] = await Promise.all([
    strapiGetAll<WithSlug>("/blogs", { fields: "slug,updatedAt", "pagination[pageSize]": "1000" }).catch(() => []),
    strapiGetAll<WithSlug>("/duyurular", { fields: "slug,updatedAt", "pagination[pageSize]": "1000" }).catch(() => []),
    strapiGetAll<WithSlug>("/haberler", { fields: "slug,updatedAt", "pagination[pageSize]": "1000" }).catch(() => []),
  ]);

  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : undefined,
      priority: 0.7,
      changeFrequency: "monthly",
    }));

  const duyuruPages: MetadataRoute.Sitemap = duyurular
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${BASE_URL}/duyurular/${d.slug}`,
      lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
      priority: 0.7,
      changeFrequency: "monthly",
    }));

  const haberPages: MetadataRoute.Sitemap = haberler
    .filter((h) => h.slug)
    .map((h) => ({
      url: `${BASE_URL}/haberler/${h.slug}`,
      lastModified: h.updatedAt ? new Date(h.updatedAt) : undefined,
      priority: 0.7,
      changeFrequency: "monthly",
    }));

  return [...staticPages, ...blogPages, ...duyuruPages, ...haberPages];
}
