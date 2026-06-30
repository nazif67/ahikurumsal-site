"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type Blog = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
};

export default function BlogList({ posts }: { posts: Blog[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categories = useMemo(() => {
    const cats = posts.map((p) => p.category).filter(Boolean);
    return ["Tümü", ...Array.from(new Set(cats))];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "Tümü" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  return (
    <>
      {/* Arama */}
      <div className="mt-8 relative">
        <input
          type="text"
          placeholder="Blog yazısı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Kategori filtreleri */}
      {categories.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Sonuçlar */}
      <div className="mt-6 space-y-6">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Arama kriterlerine uygun yazı bulunamadı.</p>
          </div>
        )}
        {filtered.map((post) => (
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
            <h2 className="mt-1 text-xl font-semibold text-gray-900">{post.title}</h2>
            {post.excerpt && (
              <p className="mt-2 text-gray-500 line-clamp-2">{post.excerpt}</p>
            )}
            <p className="mt-3 text-sm text-blue-600 font-medium">Devamını oku →</p>
          </Link>
        ))}
      </div>
    </>
  );
}
