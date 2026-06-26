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
      <HesaplamaAraclari />
    </div>
  );
}
