import { strapiGetAll } from "@/lib/strapi";
import DuyurularList from "./DuyurularList";

export const revalidate = 60;
export const metadata = { title: "Duyurular" };

type Duyuru = {
  title: string;
  slug: string;
  content: string;
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Duyurular</h1>
      <p className="mt-2 text-gray-500">
        Güncel duyurular ve önemli bilgilendirmeler
      </p>
      <DuyurularList duyurular={duyurular} />
    </div>
  );
}
