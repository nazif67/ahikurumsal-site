"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ViewBadge } from "@/components/Views";

type Duyuru = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
  views: number;
};

export default function DuyurularList({ duyurular }: { duyurular: Duyuru[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categories = useMemo(() => {
    const cats = duyurular.map((d) => d.category).filter(Boolean);
    return ["Tümü", ...Array.from(new Set(cats))];
  }, [duyurular]);

  const filtered = useMemo(() => {
    return duyurular.filter((d) => {
      const matchesSearch =
        search === "" ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.content ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "Tümü" || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [duyurular, search, activeCategory]);

  return (
    <>
      {/* Arama */}
      <div className="mt-8 relative">
        <input
          type="text"
          placeholder="Duyuru ara..."
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
            <p className="text-gray-500">Arama kriterlerine uygun duyuru bulunamadı.</p>
          </div>
        )}
        {filtered.map((d) => (
          <Link
            key={d.documentId}
            href={`/duyurular/${d.slug}`}
            className={`block rounded-xl border bg-white p-5 hover:shadow-md transition-all ${
              d.pinned
                ? "border-blue-200 hover:border-blue-300"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {d.date && <p className="text-xs text-gray-400">{d.date}</p>}
              {d.pinned && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Sabit
                </span>
              )}
              {d.category && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {d.category}
                </span>
              )}
              <span className="ml-auto">
                <ViewBadge views={d.views} />
              </span>
            </div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">{d.title}</h2>
            {d.content && (
              <p className="mt-2 text-gray-500 line-clamp-3">{d.content}</p>
            )}
            <p className="mt-3 text-sm text-blue-600 font-medium">Devamını oku →</p>
          </Link>
        ))}
      </div>
    </>
  );
}
