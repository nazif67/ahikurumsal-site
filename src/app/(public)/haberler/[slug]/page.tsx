import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll, getStrapiMedia } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { ViewCounter } from "@/components/Views";
import Comments from "./Comments";
import RelatedPosts from "@/components/RelatedPosts";
import PaylasButonlari from "@/components/PaylasButonlari";

export const revalidate = 60;

type StrapiMedia = { url?: string; width?: number; height?: number } | null;

type Haber = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
  views: number;
  coverImage?: StrapiMedia;
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
      populate: "coverImage",
    });
    if (data.length > 0) {
      const haber = data[0] as Haber & { id: number; documentId: string };
      const url = `https://ahikurumsal.com/haberler/${params.slug}`;
      const kapak = getStrapiMedia(haber.coverImage?.url);
      return {
        title: haber.title,
        description: haber.excerpt || undefined,
        alternates: { canonical: url },
        openGraph: {
          title: haber.title,
          description: haber.excerpt || undefined,
          url,
          type: "article",
          siteName: "Ahikurumsal",
          locale: "tr_TR",
          ...(kapak ? { images: [kapak] } : {}),
        },
        twitter: { card: "summary_large_image", title: haber.title, description: haber.excerpt || undefined },
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
      populate: "coverImage",
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

  const url = `https://ahikurumsal.com/haberler/${haber.slug}`;
  const kapak = getStrapiMedia(haber.coverImage?.url);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: haber.title,
    description: haber.excerpt || undefined,
    image: kapak ? [kapak] : undefined,
    datePublished: haber.date || undefined,
    dateModified: haber.date || undefined,
    author: haber.author
      ? { "@type": "Person", name: haber.author }
      : { "@type": "Organization", name: "Ahikurumsal" },
    publisher: {
      "@type": "Organization",
      name: "Ahikurumsal",
      logo: { "@type": "ImageObject", url: "https://ahikurumsal.com/ahikurumsal.jpg" },
    },
    mainEntityOfPage: url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://ahikurumsal.com" },
      { "@type": "ListItem", position: 2, name: "Haberler", item: "https://ahikurumsal.com/haberler" },
      { "@type": "ListItem", position: 3, name: haber.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/haberler" className="hover:text-gray-600">Haberler</Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{haber.title}</span>
      </nav>

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

      {kapak && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={kapak}
          alt={haber.title}
          width={haber.coverImage?.width || undefined}
          height={haber.coverImage?.height || undefined}
          className="mt-8 w-full rounded-2xl border border-gray-100 object-cover"
          loading="lazy"
        />
      )}

      <div
        className="prose-content mt-8 text-gray-700"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <PaylasButonlari
        url={`https://ahikurumsal.com/haberler/${haber.slug}`}
        baslik={haber.title}
      />

      <Comments haberId={haber.id} yorumlar={yorumlar} />

      <RelatedPosts items={related} basePath="/haberler" heading="Diğer Haberler" />
    </article>
  );
}
