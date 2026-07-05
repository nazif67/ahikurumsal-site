import { strapiGetAll } from "@/lib/strapi";
import DuyurularList from "./DuyurularList";

export const revalidate = 60;
export const metadata = {
  title: "Duyurular",
  description:
    "Ahikurumsal güncel duyuruları: mevzuat değişiklikleri, önemli tarihler ve İK ile ilgili bilgilendirmeler.",
  alternates: { canonical: "https://ahikurumsal.com/duyurular" },
  openGraph: {
    title: "Duyurular | Ahikurumsal",
    description: "Güncel duyurular ve önemli bilgilendirmeler.",
    url: "https://ahikurumsal.com/duyurular",
  },
};

type Duyuru = {
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
  views: number;
};

export default async function DuyurularPage() {
  let duyurular: (Duyuru & { id: number; documentId: string })[] = [];
  try {
    duyurular = await strapiGetAll<Duyuru>("/duyurular", {
      sort: "pinned:desc,date:desc",
      fields: "title,slug,content,date,category,pinned,author,views",
    });
  } catch {
    duyurular = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Duyurular</h1>
      <p className="mt-2 text-gray-500">
        Güncel duyurular ve önemli bilgilendirmeler
      </p>
      <DuyurularList duyurular={duyurular} />
    </div>
  );
}
