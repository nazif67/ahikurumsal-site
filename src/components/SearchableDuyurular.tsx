"use client";

import { useState } from "react";

type Duyuru = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  category: string;
  pinned: boolean;
};

type Props = {
  duyurular: Duyuru[];
};

export default function SearchableDuyurular({ duyurular }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(duyurular.map((d) => d.category).filter(Boolean))
  );

  const filtered = duyurular.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(q) ||
      (d.excerpt && d.excerpt.toLowerCase().includes(q)) ||
      (d.content && d.content.toLowerCase().includes(q));
    const matchesCategory =
      !selectedCategory || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      {/* Sidebar */}
      <aside className="w-full md:w-56 flex-shrink-0 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arama
          </label>
          <input
            type="text"
            placeholder="Başlık veya içerik ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {categories.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Kategoriler
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Tümü{" "}
                  <span className="text-xs opacity-70">
                    ({duyurular.length})
                  </span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() =>
                      setSelectedCategory(cat === selectedCategory ? null : cat)
                    }
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat}{" "}
                    <span className="text-xs opacity-70">
                      (
                      {duyurular.filter((d) => d.category === cat).length}
                      )
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Duyuru listesi */}
      <div className="flex-1 space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Sonuç bulunamadı.</p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.documentId}
              className={`bg-white rounded-xl border p-6 ${
                d.pinned
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {d.pinned && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    Sabit
                  </span>
                )}
                {d.category && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {d.category}
                  </span>
                )}
                {d.date && (
                  <span className="text-xs text-gray-400">{d.date}</span>
                )}
              </div>
              <h2 className="font-semibold text-gray-900 text-lg">
                {d.title}
              </h2>
              {d.excerpt && (
                <p className="mt-2 text-sm text-gray-500 italic">
                  {d.excerpt}
                </p>
              )}
              <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3">
                {d.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
