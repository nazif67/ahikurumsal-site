import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { ViewCounter } from "@/components/Views";
import Comments from "./Comments";

export const revalidate = 60;

type Haber = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  views: number;
};

type Yorum = {
  id: number;
  documentId: string;
  author: string;
  content: string;
  createdAt: string;
};

export async function generateStaticParams() {
  try {
    const haberler = await strapiGetAll<Haber>("/haberler", {
      "pagination[pageSize]": "1000",
      fields: "slug",
    });
    return haberler.map((h) => ({ slug: h.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const data = await strapiGetAll<Haber>("/haberler", {
      "filters[slug][$eq]": params.slug,
      fields: "title",
    });
    if (data.length > 0) return { title: data[0].title };
  } catch {}
  return { title: "Haber bulunamadı" };
}

export default async function HaberDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let haber: (Haber & { id: number; documentId: string }) | undefined;

  try {
    const data = await strapiGetAll<Haber>("/haberler", {
      "filters[slug][$eq]": params.slug,
    });
    haber = data[0];
  } catch {
    notFound();
  }

  if (!haber) notFound();

  const contentHtml = await renderMarkdown(haber.content);

  let yorumlar: Yorum[] = [];
  try {
    yorumlar = await strapiGetAll<Yorum>("/yorumlar", {
      "filters[haber][slug][$eq]": params.slug,
      sort: "createdAt:desc",
    });
  } catch {
    yorumlar = [];
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/haberler"
        className="text-sm text-brand hover:underline inline-block mb-6"
      >
        ← Haberlere dön
      </Link>

      <div className="flex items-center gap-2 mb-2">
        {haber.date && <p className="text-sm text-gray-400">{haber.date}</p>}
        {haber.category && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
            {haber.category}
          </span>
        )}
        <span className="ml-auto">
          <ViewCounter type="haberler" slug={haber.slug} initialViews={haber.views ?? 0} />
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">{haber.title}</h1>

      {haber.excerpt && (
        <p className="mt-4 text-lg text-gray-500 border-l-4 border-brand pl-4 italic">
          {haber.excerpt}
        </p>
      )}

      <div
        className="prose-content mt-8 text-gray-700"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <Comments haberId={haber.id} yorumlar={yorumlar} />
    </article>
  );
}
