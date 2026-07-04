"use client";

import Link from "next/link";
import ContentList from "@/components/ContentList";
import { ViewBadge } from "@/components/Views";

type Blog = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  views: number;
};

export default function BlogList({ posts }: { posts: Blog[] }) {
  return (
    <ContentList
      items={posts}
      searchPlaceholder="Blog yazısı ara..."
      emptyMessage="Arama kriterlerine uygun yazı bulunamadı."
      getCategory={(p) => p.category}
      getSearchText={(p) => `${p.title} ${p.excerpt ?? ""}`}
      getKey={(p) => p.documentId}
      renderItem={(post) => (
        <Link
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
            <span className="ml-auto">
              <ViewBadge views={post.views} />
            </span>
          </div>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">{post.title}</h2>
          {post.excerpt && (
            <p className="mt-2 text-gray-500 line-clamp-2">{post.excerpt}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            {post.author ? (
              <span className="text-xs text-gray-400">✍ {post.author}</span>
            ) : (
              <span />
            )}
            <span className="text-sm text-blue-600 font-medium">Devamını oku →</span>
          </div>
        </Link>
      )}
    />
  );
}
