"use client";

import { useState, useMemo } from "react";

type SSSItem = {
  id: number;
  question: string;
  answer: string;
  category?: string;
};

export default function SSSAccordion({ items }: { items: SSSItem[] }) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  function toggle(id: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const categories = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.category).filter(Boolean))
      ) as string[],
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((item) => {
      if (activeCategory !== "Tümü" && item.category !== activeCategory)
        return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [items, search, activeCategory]);

  const grouped = useMemo(() => {
    const cats = Array.from(
      new Set(filtered.map((i) => i.category).filter(Boolean))
    ) as string[];
    if (cats.length === 0) return [{ label: "", items: filtered }];
    return cats.map((cat) => ({
      label: cat,
      items: filtered.filter((i) => i.category === cat),
    }));
  }, [filtered]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      if (item.category) map[item.category] = (map[item.category] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const isFiltering = search.trim() !== "" || activeCategory !== "Tümü";

  return (
    <div className="mt-10">
      {/* Arama */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Soru veya cevapta ara…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenIds(new Set());
          }}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
            onClick={() => {
              setSearch("");
              setOpenIds(new Set());
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Aramayı temizle"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Kategori filtreleri */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => {
            setActiveCategory("Tümü");
            setOpenIds(new Set());
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "Tümü"
              ? "bg-brand text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tümü
          <span
            className={`ml-1.5 text-xs ${
              activeCategory === "Tümü" ? "text-white/70" : "text-gray-400"
            }`}
          >
            {items.length}
          </span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIds(new Set());
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
            <span
              className={`ml-1.5 text-xs ${
                activeCategory === cat ? "text-white/70" : "text-gray-400"
              }`}
            >
              {categoryCounts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Sonuç sayısı */}
      {isFiltering && (
        <p className="mb-4 text-xs text-gray-400">
          {filtered.length} sonuç bulundu
        </p>
      )}

      {/* Sorular */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500 text-sm">
            {search
              ? `"${search}" için sonuç bulunamadı.`
              : "Bu kategoride henüz soru yok."}
          </p>
          {isFiltering && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("Tümü");
              }}
              className="mt-3 text-sm text-brand hover:underline"
            >
              Filtreyi temizle
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ label, items: group }) => (
            <div key={label || "all"}>
              {label && (
                <h2 className="mb-4 text-lg font-bold text-brand border-l-4 border-brand pl-3">
                  {label}
                </h2>
              )}
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white overflow-hidden">
                {group.map((item) => {
                  const isOpen = openIds.has(item.id);
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggle(item.id)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                          {item.question}
                        </span>
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isOpen
                              ? "bg-brand text-white rotate-180"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-100 bg-gray-50/50">
                          <div className="pt-4">{item.answer}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
