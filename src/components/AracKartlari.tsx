import Link from "next/link";
import { ARACLAR } from "@/lib/araclarData";

/**
 * Hesaplama araçlarını kart olarak listeler; her kart araca özel sayfaya link.
 * haricSlug verilirse o araç listelenmez (araç sayfalarında "diğer araçlar" için).
 */
export default function AracKartlari({
  haricSlug,
  baslik = "Tüm Hesaplama Araçları",
}: {
  haricSlug?: string;
  baslik?: string;
}) {
  const liste = ARACLAR.filter((a) => a.slug !== haricSlug);

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{baslik}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((a) => (
          <Link
            key={a.slug}
            href={`/araclar/${a.slug}`}
            className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
              {a.ad}
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{a.kart}</p>
            <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600">
              Hesapla
              <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
