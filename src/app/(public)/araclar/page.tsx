import HesaplamaAraclari from "@/components/HesaplamaAraclari";

export const metadata = { title: "Hesaplama Araçları" };

export default function AraclarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Hesaplama Araçları</h1>
      <p className="mt-2 text-gray-500 mb-8">
        Kıdem tazminatı, ihbar tazminatı, fazla mesai ve maaş zammı
        hesaplamaları. Sonuçlar bilgi amaçlıdır.
      </p>
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
        <span className="text-amber-500 text-base leading-snug flex-shrink-0">⚠</span>
        <p>
          Bu hesaplama aracı yalnızca bilgilendirme amacıyla sunulmaktadır ve
          elde edilen sonuçlar kesinlik taşımamaktadır. Karar almadan önce
          mutlaka uzman görüşüne başvurmanız önerilir.
        </p>
      </div>

      <HesaplamaAraclari />
    </div>
  );
}
