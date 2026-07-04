"use client";

import Link from "next/link";
import ContentList from "@/components/ContentList";
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
  author: string;
  views: number;
};

export default function DuyurularList({ duyurular }: { duyurular: Duyuru[] }) {
  return (
    <ContentList
      items={duyurular}
      searchPlaceholder="Duyuru ara..."
      emptyMessage="Arama kriterlerine uygun duyuru bulunamadı."
      getCategory={(d) => d.category}
      getSearchText={(d) => `${d.title} ${d.content ?? ""}`}
      getKey={(d) => d.documentId}
      renderItem={(d) => (
        <Link
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
          <div className="mt-3 flex items-center justify-between">
            {d.author ? (
              <span className="text-xs text-gray-400">✍ {d.author}</span>
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
