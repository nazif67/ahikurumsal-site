import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll, getStrapiMedia } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { ViewCounter } from "@/components/Views";
import RelatedPosts from "@/components/RelatedPosts";
import PaylasButonlari from "@/components/PaylasButonlari";

export const revalidate = 60;

type StrapiMedia = { url?: string; width?: number; height?: number } | null;

type Blog = {
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

export async function generateStaticParams() {
  try {
    const blogs = await strapiGetAll<Blog>("/blogs", {
      "pagination[pageSize]": "1000",
      fields: "slug",
    });
    return blogs.map((b) => ({ slug: b.slug }));
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
    const data = await strapiGetAll<Blog>("/blogs", {
      "filters[slug][$eq]": params.slug,
      fields: "title,excerpt",
      populate: "coverImage",
    });
    if (data.length > 0) {
      const post = data[0] as Blog & { id: number; documentId: string };
      const url = `https://ahikurumsal.com/blog/${params.slug}`;
      const kapak = getStrapiMedia(post.coverImage?.url);
      return {
        title: post.title,
        description: post.excerpt || undefined,
        alternates: { canonical: url },
        openGraph: {
          title: post.title,
          description: post.excerpt || undefined,
          url,
          type: "article",
          siteName: "Ahikurumsal",
          locale: "tr_TR",
          ...(kapak ? { images: [kapak] } : {}),
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.excerpt || undefined },
      };
    }
  } catch {}
  return { title: "Yazı bulunamadı" };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post: (Blog & { id: number; documentId: string }) | undefined;

  try {
    const data = await strapiGetAll<Blog>("/blogs", {
      "filters[slug][$eq]": params.slug,
      populate: "coverImage",
    });
    post = data[0];
  } catch {
    notFound();
  }

  if (!post) notFound();

  const [contentHtml, allOthers] = await Promise.all([
    renderMarkdown(post.content),
    strapiGetAll<Blog>("/blogs", {
      "filters[slug][$ne]": params.slug,
      "pagination[pageSize]": "10",
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category,author",
    }).catch(() => []),
  ]);

  const related = [
    ...allOthers.filter((b) => b.category && b.category === post!.category),
    ...allOthers.filter((b) => !b.category || b.category !== post!.category),
  ].slice(0, 3);

  const url = `https://ahikurumsal.com/blog/${post.slug}`;
  const kapak = getStrapiMedia(post.coverImage?.url);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: kapak ? [kapak] : undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
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
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://ahikurumsal.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
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
        <Link href="/blog" className="hover:text-gray-600">Blog</Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{post.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {post.date && <p className="text-sm text-gray-400">{post.date}</p>}
        {post.category && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
        )}
        <span className="ml-auto">
          <ViewCounter type="blogs" slug={post.slug} initialViews={post.views ?? 0} />
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

      {post.author && (
        <p className="mt-2 text-sm text-gray-500">✍ {post.author}</p>
      )}

      {post.excerpt && (
        <p className="mt-4 text-lg text-gray-500 border-l-4 border-brand pl-4 italic">
          {post.excerpt}
        </p>
      )}

      {kapak && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={kapak}
          alt={post.title}
          width={post.coverImage?.width || undefined}
          height={post.coverImage?.height || undefined}
          className="mt-8 w-full rounded-2xl border border-gray-100 object-cover"
          loading="lazy"
        />
      )}

      <div
        className="prose-content mt-8 text-gray-700"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <PaylasButonlari
        url={`https://ahikurumsal.com/blog/${post.slug}`}
        baslik={post.title}
      />

      <RelatedPosts items={related} basePath="/blog" heading="Diğer Blog Yazıları" />
    </article>
  );
}
