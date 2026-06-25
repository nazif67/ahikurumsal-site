const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

type StrapiCollectionResponse<T> = {
  data: (T & { id: number; documentId: string })[];
  meta: { pagination: { total: number } };
};

type StrapiSingleResponse<T> = {
  data: (T & { id: number; documentId: string }) | null;
  meta: object;
};

export function getStrapiUrl(): string {
  return STRAPI_URL;
}

export function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

export async function strapiGetAll<T>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<(T & { id: number; documentId: string })[]> {
  const searchParams = new URLSearchParams({
    "pagination[pageSize]": "100",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const res = await fetch(`${STRAPI_URL}/api${path}?${searchParams}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Strapi hata: ${res.status} — ${path}`);
  const json: StrapiCollectionResponse<T> = await res.json();
  return json.data ?? [];
}

export async function strapiGetSingle<T>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<(T & { id: number; documentId: string }) | null> {
  const searchParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    )
  );

  const url =
    `${STRAPI_URL}/api${path}` +
    (searchParams.toString() ? `?${searchParams}` : "");
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`Strapi hata: ${res.status} — ${path}`);
  const json: StrapiSingleResponse<T> = await res.json();
  return json.data;
}
