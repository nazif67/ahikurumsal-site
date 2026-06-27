import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";

export const revalidate = 60;
export const metadata = { title: "Blog" };

type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
};

export default async function BlogIndexPage() {
  let posts: (Blog & { id: number; documentId: string })[] = [];
  try {
    posts = await strapiGetAll<Blog>("/blogs", {
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category",
    });
  } catch {
    posts = [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-500">
        İnsan kaynakları ve iş dünyası hakkında yazılar.
      </p>

      <div className="mt-8 space-y-6">
        {posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">
              Henüz yazı yok. Strapi admin panelinden blog yazısı ekleyin.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-gray-400">{post.date}</p>
              {post.category && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-2 text-gray-500 line-clamp-2">{post.excerpt}</p>
            )}
            <p className="mt-3 text-sm text-blue-600 font-medium">
              Devamını oku →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
