import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import ViewTracker from "@/components/ViewTracker";

export const revalidate = 60;

type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  viewCount?: number;
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
      fields: "title",
    });
    if (data.length > 0) return { title: data[0].title };
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
      <ViewTracker documentId={post.documentId} />

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
        {post.viewCount != null && post.viewCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {post.viewCount} okuma
          </span>
        )}
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
