import { strapiGetAll } from "@/lib/strapi";
import HaberlerList from "./HaberlerList";

export const revalidate = 60;
export const metadata = {
  title: "Haberler",
  description: "İş hukuku, mevzuat, SGK ve İK dünyasından güncel haberler.",
  alternates: { canonical: "https://ahikurumsal.com/haberler" },
};

type Haber = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  views: number;
};

export default async function HaberlerPage() {
  let haberler: (Haber & { id: number; documentId: string })[] = [];
  try {
    haberler = await strapiGetAll<Haber>("/haberler", {
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category,author,views",
    });
  } catch {
    haberler = [];
  }

  return (
    <>
      {/* Haber Başlığı */}
      <div className="bg-brand border-b-4 border-blue-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Canlı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">HABERLER</h1>
          </div>
          <p className="text-blue-200 text-sm hidden sm:block">
            İş hukuku, mevzuat ve İK dünyasından güncel haberler
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {haberler.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">
              Henüz haber yok. Strapi admin panelinden haber ekleyin.
            </p>
          </div>
        ) : (
          <HaberlerList haberler={haberler} />
        )}
      </div>
    </>
  );
}
