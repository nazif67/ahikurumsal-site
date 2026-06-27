import { strapiGetAll } from "@/lib/strapi";

export const revalidate = 60;
export const metadata = { title: "Duyurular" };

type Duyuru = {
  title: string;
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

      <div className="mt-8 space-y-6">
        {duyurular.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Henüz duyuru bulunmuyor.</p>
          </div>
        )}

        {duyurular.map((d) => (
          <div
            key={d.documentId}
            className={`block rounded-xl border bg-white p-5 ${
              d.pinned ? "border-blue-200" : "border-gray-200"
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
            </div>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {d.title}
            </h2>

            {d.content && (
              <p className="mt-2 text-gray-500">{d.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
