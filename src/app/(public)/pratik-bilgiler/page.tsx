import { strapiGetAll } from "@/lib/strapi";
import PratikBilgilerList from "./PratikBilgilerList";

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
      <PratikBilgilerList haberler={haberler} />
    </div>
  );
}
