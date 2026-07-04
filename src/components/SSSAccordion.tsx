"use client";

import { useState } from "react";

type SSSItem = {
  id: number;
  question: string;
  answer: string;
  category?: string;
};

export default function SSSAccordion({ items }: { items: SSSItem[] }) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const categories = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean))
  ) as string[];

  const grouped =
    categories.length > 0
      ? categories.map((cat) => ({
          label: cat,
          items: items.filter((i) => i.category === cat),
        }))
      : [{ label: "", items }];

  return (
    <div className="mt-10 space-y-10">
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
  );
}
