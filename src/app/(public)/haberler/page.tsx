import { strapiGetAll } from "@/lib/strapi";
import HaberlerList from "./HaberlerList";

export const revalidate = 60;
export const metadata = { title: "Haberler" };

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
      fields: "title,slug,excerpt,date,category,views",
    });
  } catch {
    haberler = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Haberler</h1>
      <p className="mt-2 text-gray-500">
        İş hukuku, mevzuat ve İK dünyasından güncel haberler.
      </p>
      {haberler.length === 0 ? (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500">
            Henüz haber yok. Strapi admin panelinden haber ekleyin.
          </p>
        </div>
      ) : (
        <HaberlerList haberler={haberler} />
      )}
    </div>
  );
}
