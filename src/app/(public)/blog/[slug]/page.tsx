import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { ViewCounter } from "@/components/Views";

export const revalidate = 60;

type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  views: number;
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
    });
    if (data.length > 0) {
      const post = data[0] as Blog & { id: number; documentId: string };
      return {
        title: post.title,
        description: post.excerpt || undefined,
        alternates: { canonical: `https://ahikurumsal.com/blog/${params.slug}` },
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

  const contentHtml = await renderMarkdown(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="text-sm text-brand hover:underline inline-block mb-6"
      >
        ← Blog&apos;a dön
      </Link>

      <div className="flex items-center gap-2 mb-2">
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

      {post.excerpt && (
        <p className="mt-4 text-lg text-gray-500 border-l-4 border-brand pl-4 italic">
          {post.excerpt}
        </p>
      )}

      <div
        className="prose-content mt-8 text-gray-700"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
