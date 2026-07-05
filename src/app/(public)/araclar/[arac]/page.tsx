import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HesaplamaAraclari from "@/components/HesaplamaAraclari";
import AracKartlari from "@/components/AracKartlari";
import { getAraclarVeri } from "@/lib/araclarVeri";
import { ARACLAR, aracBul } from "@/lib/araclarData";

export const revalidate = 3600;

const BASE = "https://ahikurumsal.com";

export function generateStaticParams() {
  return ARACLAR.map((a) => ({ arac: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { arac: string };
}): Metadata {
  const arac = aracBul(params.arac);
  if (!arac) return { title: "Araç bulunamadı" };
  const url = `${BASE}/araclar/${arac.slug}`;
  return {
    title: arac.metaBaslik,
    description: arac.metaAciklama,
    keywords: arac.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: arac.metaBaslik,
      description: arac.metaAciklama,
      url,
      type: "website",
      siteName: "Ahikurumsal",
      locale: "tr_TR",
    },
  };
}

export default async function AracDetayPage({
  params,
}: {
  params: { arac: string };
}) {
  const arac = aracBul(params.arac);
  if (!arac) notFound();

  const { kidemTavani, tavanTarihi, maasParams } = await getAraclarVeri();
  const url = `${BASE}/araclar/${arac.slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: arac.sss.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE },
      { "@type": "ListItem", position: 2, name: "Hesaplama Araçları", item: `${BASE}/araclar` },
      { "@type": "ListItem", position: 3, name: arac.ad, item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-gray-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:text-gray-600">Hesaplama Araçları</Link>
          <span>/</span>
          <span className="text-gray-600">{arac.ad}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900">{arac.h1}</h1>
        <div className="mt-4 text-gray-600 leading-relaxed space-y-3 prose-content">
          {arac.icerik}
        </div>

        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 my-6 text-sm text-amber-800">
          <span className="text-amber-500 text-base leading-snug flex-shrink-0">⚠</span>
          <p>
            Sonuçlar yalnızca bilgilendirme amaçlıdır ve kesinlik taşımaz. Karar
            almadan önce bir uzmana danışmanız önerilir.
          </p>
        </div>
      </div>

      <HesaplamaAraclari
        kidemTavani={kidemTavani}
        tavanTarihi={tavanTarihi}
        maasParams={maasParams}
        soloArac={arac.tabId}
      />

      {/* SSS */}
      {arac.sss.length > 0 && (
        <section className="max-w-3xl mt-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {arac.sss.map((s) => (
              <details key={s.soru} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 list-none">
                  {s.soru}
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{s.cevap}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <AracKartlari haricSlug={arac.slug} baslik="Diğer Hesaplama Araçları" />
    </div>
  );
}
