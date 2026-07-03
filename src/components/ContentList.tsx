"use client";

import { useState, useMemo, useEffect, useRef, ReactNode } from "react";

type ContentListProps<T> = {
  items: T[];
  searchPlaceholder: string;
  emptyMessage: string;
  listClassName?: string;
  getCategory: (item: T) => string;
  getSearchText: (item: T) => string;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  batchSize?: number;
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
  batchSize = 10,
}: ContentListProps<T>) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const cats = items.map(getCategory).filter(Boolean);
    return ["Tümü", ...Array.from(new Set(cats))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        q === "" || getSearchText(item).toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "Tümü" || getCategory(item) === activeCategory;
      return matchesSearch && matchesCategory;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, activeCategory]);

  // Filtre değişince listeyi baştan göster
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [search, activeCategory, batchSize]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + batchSize);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, batchSize]);

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
      <div className={`mt-6 ${listClassName}`}>
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
        {visible.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      {/* Sonsuz kaydırma nöbetçisi */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-6 flex justify-center py-4">
          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Yükleniyor...
          </span>
        </div>
      )}
    </>
  );
}
