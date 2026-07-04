import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { ViewCounter } from "@/components/Views";
import Comments from "./Comments";
import RelatedPosts from "@/components/RelatedPosts";

export const revalidate = 60;

type Haber = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
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
      fields: "title,excerpt",
    });
    if (data.length > 0) {
      const haber = data[0] as Haber & { id: number; documentId: string };
      return {
        title: haber.title,
        description: haber.excerpt || undefined,
        alternates: { canonical: `https://ahikurumsal.com/haberler/${params.slug}` },
      };
    }
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

  const [contentHtml, yorumlar, allOthers] = await Promise.all([
    renderMarkdown(haber.content),
    strapiGetAll<Yorum>("/yorumlar", {
      "filters[haber][slug][$eq]": params.slug,
      "filters[approved][$eq]": "true",
      sort: "createdAt:desc",
    }).catch(() => []),
    strapiGetAll<Haber>("/haberler", {
      "filters[slug][$ne]": params.slug,
      "pagination[pageSize]": "10",
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category,author",
    }).catch(() => []),
  ]);

  const related = [
    ...allOthers.filter((h) => h.category && h.category === haber!.category),
    ...allOthers.filter((h) => !h.category || h.category !== haber!.category),
  ].slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/haberler"
        className="text-sm text-brand hover:underline inline-block mb-6"
      >
        ← Haberlere dön
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-2">
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

      {haber.author && (
        <p className="mt-2 text-sm text-gray-500">✍ {haber.author}</p>
      )}

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

      <RelatedPosts items={related} basePath="/haberler" heading="Diğer Haberler" />
    </article>
  );
}
