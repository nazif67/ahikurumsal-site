import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";

export const revalidate = 60;
export const metadata = { title: "Pratik Bilgiler" };

type Haber = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
};

export default async function PratikBilgilerPage() {
  let haberler: (Haber & { id: number; documentId: string })[] = [];
  try {
    haberler = await strapiGetAll<Haber>("/haberler", {
      sort: "date:desc",
      fields: "title,slug,excerpt,date,category",
    });
  } catch {
    haberler = [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Pratik Bilgiler</h1>
      <p className="mt-2 text-gray-500">
        İş hukuku, mevzuat ve çalışma hayatına dair pratik bilgiler.
      </p>

      <div className="mt-8 space-y-4">
        {haberler.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">
              Henüz içerik yok. Strapi admin panelinden ekleyin.
            </p>
          </div>
        )}
        {haberler.map((haber) => (
          <Link
            key={haber.slug}
            href={`/pratik-bilgiler/${haber.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              {haber.date && (
                <p className="text-xs text-gray-400">{haber.date}</p>
              )}
              {haber.category && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  {haber.category}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {haber.title}
            </h2>
            {haber.excerpt && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {haber.excerpt}
              </p>
            )}
            <p className="mt-3 text-sm text-blue-600 font-medium">
              Devamını oku →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
