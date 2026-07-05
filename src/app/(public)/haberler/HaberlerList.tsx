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

const CATEGORY_COLORS: Record<string, string> = {
  "İş Hukuku":       "bg-blue-600",
  "SGK":             "bg-emerald-600",
  "Mevzuat":         "bg-purple-600",
  "Duyuru":          "bg-amber-500",
  "Çalışma İzni":    "bg-rose-600",
  "Asgari Ücret":    "bg-orange-500",
};

function categoryColor(cat?: string) {
  if (!cat) return "bg-brand";
  return CATEGORY_COLORS[cat] ?? "bg-brand";
}

function FeaturedCard({ haber }: { haber: Haber }) {
  return (
    <Link
      href={`/haberler/${haber.slug}`}
      className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-all duration-200"
    >
      <div className="h-2 w-full bg-brand" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {haber.category && (
            <span className={`${categoryColor(haber.category)} text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide`}>
              {haber.category}
            </span>
          )}
          <span className="text-xs text-gray-400">{haber.date}</span>
          <span className="ml-auto">
            <ViewBadge views={haber.views} />
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-brand transition-colors leading-snug">
          {haber.title}
        </h2>
        {haber.excerpt && (
          <p className="mt-3 text-gray-500 leading-relaxed line-clamp-3">
            {haber.excerpt}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between">
          {haber.author && (
            <span className="text-xs text-gray-400">✍ {haber.author}</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
            Haberi Oku
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsRow({ haber }: { haber: Haber }) {
  return (
    <Link
      href={`/haberler/${haber.slug}`}
      className="group flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/70 -mx-3 px-3 rounded-lg transition-colors"
    >
      <div className={`flex-shrink-0 w-1 self-stretch rounded-full ${categoryColor(haber.category)}`} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {haber.category && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {haber.category}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors leading-snug text-sm sm:text-base">
          {haber.title}
        </h3>
        {haber.excerpt && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-1 leading-relaxed">
            {haber.excerpt}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-gray-400">{haber.date}</span>
          {haber.author && (
            <span className="text-xs text-gray-400">✍ {haber.author}</span>
          )}
          <span className="ml-auto">
            <ViewBadge views={haber.views} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HaberlerList({ haberler }: { haberler: Haber[] }) {
  return (
    <ContentList
      items={haberler}
      searchPlaceholder="Haber ara..."
      emptyMessage="Arama kriterlerine uygun haber bulunamadı."
      listClassName="mt-0"
      getCategory={(h) => h.category}
      getSearchText={(h) => `${h.title} ${h.excerpt ?? ""}`}
      getKey={(h) => h.documentId}
      renderItems={(items) => {
        const [featured, ...rest] = items;
        return (
          <div className="space-y-6">
            {featured && <FeaturedCard haber={featured} />}
            {rest.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 px-3 py-1">
                {rest.map((haber) => (
                  <NewsRow key={haber.documentId} haber={haber} />
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
