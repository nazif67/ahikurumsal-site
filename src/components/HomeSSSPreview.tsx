"use client";

import { useState } from "react";
import Link from "next/link";

type SSSItem = {
  id: number;
  question: string;
  answer: string;
  category?: string;
};

export default function HomeSSSPreview({ items }: { items: SSSItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
              SSS
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Sık Sorulan Sorular</h2>
            <p className="text-gray-500 text-sm mt-1">İnsan kaynakları ve iş hukukunda en çok merak edilen sorular</p>
          </div>
          <Link
            href="/sss"
            className="flex items-center gap-1 text-sm font-medium text-brand hover:underline whitespace-nowrap"
          >
            Tüm soruları gör
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen ? "bg-brand text-white rotate-180" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sss"
            className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tüm Soruları Görüntüle
          </Link>
        </div>
      </div>
    </section>
  );
}
