import { strapiGetAll, getStrapiUrl } from "@/lib/strapi";

export const revalidate = 60;
export const metadata = { title: "Hazır Şablonlar" };

type Sablon = {
  title: string;
  description: string;
  category: string;
  file: {
    url: string;
    name: string;
    size: number;
    ext: string;
  } | null;
};

function formatFileSize(kb: number): string {
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function HazirSablonlarPage() {
  let sablonlar: (Sablon & { id: number; documentId: string })[] = [];
  try {
    sablonlar = await strapiGetAll<Sablon>("/sablonlar", {
      populate: "file",
      sort: "category:asc,title:asc",
    });
  } catch {
    sablonlar = [];
  }

  const grouped = sablonlar.reduce<Record<string, typeof sablonlar>>(
    (acc, s) => {
      const key = s.category || "Diğer";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {}
  );

  const strapiUrl = getStrapiUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Hazır Şablonlar</h1>
      <p className="mt-2 text-gray-500">
        İndirmeye hazır İK form ve şablonları
      </p>

      <div className="mt-8 space-y-10">
        {sablonlar.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">Henüz şablon eklenmemiş.</p>
          </div>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
              {category}
            </h2>
            <div className="space-y-3">
              {items.map((s) => {
                const fileUrl = s.file?.url
                  ? s.file.url.startsWith("http")
                    ? s.file.url
                    : `${strapiUrl}${s.file.url}`
                  : null;

                return (
                  <div
                    key={s.documentId}
                    className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{s.title}</p>
                        {s.description && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {s.description}
                          </p>
                        )}
                        {s.file && (
                          <p className="text-xs text-gray-400 mt-1">
                            {s.file.ext?.toUpperCase().replace(".", "")}{" "}
                            {formatFileSize(s.file.size)}
                          </p>
                        )}
                      </div>
                    </div>

                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        download
                        className="ml-4 flex-shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        İndir
                      </a>
                    ) : (
                      <span className="ml-4 flex-shrink-0 text-sm text-gray-400">
                        Dosya yok
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
