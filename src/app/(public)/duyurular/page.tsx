import { strapiGetAll } from "@/lib/strapi";
import SearchableDuyurular from "@/components/SearchableDuyurular";

export const revalidate = 60;
export const metadata = { title: "Duyurular" };

type Duyuru = {
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  pinned: boolean;
};

export default async function DuyurularPage() {
  let duyurular: (Duyuru & { id: number; documentId: string })[] = [];
  try {
    duyurular = await strapiGetAll<Duyuru>("/duyurular", {
      sort: "pinned:desc,date:desc",
    });
  } catch {
    duyurular = [];
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Duyurular</h1>
      <p className="text-gray-500">
        Güncel duyurular ve önemli bilgilendirmeler
      </p>

      <SearchableDuyurular duyurular={duyurular} />
    </div>
  );
}
