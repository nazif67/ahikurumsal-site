import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";
import { ViewCounter } from "@/components/Views";
import RelatedPosts from "@/components/RelatedPosts";

export const revalidate = 60;

type Duyuru = {
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
  author: string;
  views: number;
};

export async function generateStaticParams() {
  try {
    const duyurular = await strapiGetAll<Duyuru>("/duyurular", {
      "pagination[pageSize]": "1000",
      fields: "slug",
    });
    return duyurular.map((d) => ({ slug: d.slug }));
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
    const data = await strapiGetAll<Duyuru>("/duyurular", {
      "filters[slug][$eq]": params.slug,
      fields: "title,content",
    });
    if (data.length > 0) {
      const duyuru = data[0] as Duyuru & { id: number; documentId: string };
      return {
        title: duyuru.title,
        description: duyuru.content ? duyuru.content.slice(0, 160) : undefined,
        alternates: { canonical: `https://ahikurumsal.com/duyurular/${params.slug}` },
      };
    }
  } catch {}
  return { title: "Duyuru bulunamadı" };
}

export default async function DuyuruDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let duyuru: (Duyuru & { id: number; documentId: string }) | undefined;

  try {
    const data = await strapiGetAll<Duyuru>("/duyurular", {
      "filters[slug][$eq]": params.slug,
    });
    duyuru = data[0];
  } catch {
    notFound();
  }

  if (!duyuru) notFound();

  const allOthers = await strapiGetAll<Duyuru>("/duyurular", {
    "filters[slug][$ne]": params.slug,
    "pagination[pageSize]": "10",
    sort: "pinned:desc,date:desc",
    fields: "title,slug,content,date,category",
  }).catch(() => []);

  const related = [
    ...allOthers.filter((d) => d.category && d.category === duyuru!.category),
    ...allOthers.filter((d) => !d.category || d.category !== duyuru!.category),
  ].slice(0, 3);

  const relatedItems = related.map((d) => ({
    title: d.title,
    slug: d.slug,
    excerpt: d.content ? d.content.slice(0, 120) : undefined,
    date: d.date,
    category: d.category,
    author: d.author,
  }));

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/duyurular"
        className="text-sm text-brand hover:underline inline-block mb-6"
      >
        ← Duyurulara dön
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {duyuru.date && <p className="text-sm text-gray-400">{duyuru.date}</p>}
        {duyuru.pinned && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Sabit
          </span>
        )}
        {duyuru.category && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {duyuru.category}
          </span>
        )}
        <span className="ml-auto">
          <ViewCounter type="duyurular" slug={duyuru.slug} initialViews={duyuru.views ?? 0} />
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">{duyuru.title}</h1>

      {duyuru.author && (
        <p className="mt-2 text-sm text-gray-500">✍ {duyuru.author}</p>
      )}

      {duyuru.content && (
        <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {duyuru.content}
        </div>
      )}

      <RelatedPosts items={relatedItems} basePath="/duyurular" heading="Diğer Duyurular" />
    </article>
  );
}
