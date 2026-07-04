"use client";

import Link from "next/link";
import ContentList from "@/components/ContentList";
import { ViewBadge } from "@/components/Views";

type Haber = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  author?: string;
  views: number;
};

export default function HaberlerList({ haberler }: { haberler: Haber[] }) {
  return (
    <ContentList
      items={haberler}
      searchPlaceholder="Haber ara..."
      emptyMessage="Arama kriterlerine uygun içerik bulunamadı."
      listClassName="space-y-4"
      getCategory={(h) => h.category}
      getSearchText={(h) => `${h.title} ${h.excerpt ?? ""}`}
      getKey={(h) => h.documentId}
      renderItem={(haber) => (
        <Link
          href={`/haberler/${haber.slug}`}
          className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            {haber.date && (
              <p className="text-xs text-gray-400">{haber.date}</p>
            )}
            {haber.category && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {haber.category}
              </span>
            )}
            <span className="ml-auto">
              <ViewBadge views={haber.views} />
            </span>
          </div>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">{haber.title}</h2>
          {haber.excerpt && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{haber.excerpt}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            {haber.author ? (
              <span className="text-xs text-gray-400">✍ {haber.author}</span>
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
