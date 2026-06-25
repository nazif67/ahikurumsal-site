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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Duyurular</h1>
      <p className="text-gray-500 mb-8">
        Güncel duyurular ve önemli bilgilendirmeler
      </p>

      {duyurular.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Henüz duyuru bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {duyurular.map((d) => (
            <div
              key={d.documentId}
              className={`bg-white rounded-xl border p-6 ${
                d.pinned ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {d.pinned && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    Sabit
                  </span>
                )}
                {d.category && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {d.category}
                  </span>
                )}
                {d.date && (
                  <span className="text-xs text-gray-400">{d.date}</span>
                )}
              </div>
              <h2 className="font-semibold text-gray-900 text-lg">{d.title}</h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {d.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
