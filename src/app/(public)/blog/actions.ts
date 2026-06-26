"use server";

import { strapiPut } from "@/lib/strapi";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function incrementBlogView(documentId: string): Promise<void> {
  try {
    const token = process.env.STRAPI_API_TOKEN;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${STRAPI_URL}/api/blogs/${documentId}?fields=viewCount`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) return;

    const json = await res.json();
    const current = (json.data?.viewCount as number) ?? 0;

    await strapiPut(`/blogs/${documentId}`, { viewCount: current + 1 });
  } catch {
    // Sayaç hatası kullanıcı deneyimini bozmasın
  }
}
