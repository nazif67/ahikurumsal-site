"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";

type ContentListProps<T> = {
  items: T[];
  searchPlaceholder: string;
  emptyMessage: string;
  listClassName?: string;
  getCategory: (item: T) => string;
  getSearchText: (item: T) => string;
  getKey: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
  renderItems?: (items: T[]) => ReactNode;
  pageSize?: number;
};

export default function ContentList<T>({
  items,
  searchPlaceholder,
  emptyMessage,
  listClassName = "space-y-6",
  getCategory,
  getSearchText,
  getKey,
  renderItem,
  renderItems,
  pageSize = 10,
}: ContentListProps<T>) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = items.map(getCategory).filter(Boolean);
    return ["Tümü", ...Array.from(new Set(cats))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch = q === "" || getSearchText(item).toLowerCase().includes(q);
      const matchesCategory = activeCategory === "Tümü" || getCategory(item) === activeCategory;
      return matchesSearch && matchesCategory;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, activeCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (safePage > 3) pages.push("...");
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <>
      {/* Arama */}
      <div className="mt-8 relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
      <div className={`mt-6 ${listClassName}`}>
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
        {filtered.length > 0 && renderItems
          ? renderItems(visible)
          : visible.map((item) => (
              <div key={getKey(item)}>{renderItem?.(item)}</div>
            ))}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {filtered.length} içerikten{" "}
            <span className="font-medium text-gray-700">
              {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
            </span>{" "}
            arası gösteriliyor
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Önceki
            </button>
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`e-${i}`} className="px-2 text-gray-400 select-none">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                    safePage === page
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sonraki →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
