import { strapiGetAll } from "@/lib/strapi";
import BlogList from "./BlogList";

export const revalidate = 60;
export const metadata = { title: "Blog" };

type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  views: number;
};

export default async function BlogIndexPage() {
  let posts: (Blog & { id: number; documentId: string })[] = [];
  try {
    posts = await strapiGetAll<Blog>("/blogs", {
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category,author,views",
    });
  } catch {
    posts = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-500">
        İnsan kaynakları ve iş dünyası hakkında yazılar.
      </p>
      <BlogList posts={posts} />
    </div>
  );
}
