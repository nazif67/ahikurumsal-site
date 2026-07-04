import { strapiGetAll } from "@/lib/strapi";
import SSSAccordion from "@/components/SSSAccordion";

export const revalidate = 60;

export const metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "İnsan kaynakları, iş hukuku, tazminat ve özlük işlerine dair sıkça sorulan soruların cevapları.",
  alternates: { canonical: "https://ahikurumsal.com/sss" },
};

type SSSItem = {
  question: string;
  answer: string;
  category: string;
  order: number;
};

export default async function SSSPage() {
  let items: (SSSItem & { id: number; documentId: string })[] = [];
  try {
    items = await strapiGetAll<SSSItem>("/sss-items", {
      sort: "order:asc",
      "pagination[pageSize]": "200",
    });
  } catch {
    items = [];
  }

  const faqSchema =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="text-center mb-2">
          <span className="inline-block bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            SSS
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Sıkça Sorulan Sorular
          </h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            İnsan kaynakları, iş hukuku ve özlük işlerine dair en çok merak
            edilen soruların cevapları aşağıda yer almaktadır.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">
              Henüz soru eklenmemiş. Strapi admin panelinden SSS içerikleri
              ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <SSSAccordion
            items={items.map((i) => ({
              id: i.id,
              question: i.question,
              answer: i.answer,
              category: i.category,
            }))}
          />
        )}
      </div>
    </>
  );
}
