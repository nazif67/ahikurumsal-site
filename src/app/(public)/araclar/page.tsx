import HesaplamaAraclari from "@/components/HesaplamaAraclari";
import AraclarSeoIcerik from "@/components/AraclarSeoIcerik";
import { strapiGetSingle } from "@/lib/strapi";
import {
  mergeMaasParams,
  type MaasParamStrapi,
} from "@/lib/maasParametreleri";

export const revalidate = 3600;

const ARAC_ACIKLAMA =
  "2026 güncel mevzuatına göre ücretsiz hesaplama araçları: brütten nete ve netten brüte maaş, kıdem tazminatı, ihbar tazminatı, fazla mesai, maaş zammı ve yıllık izin hesaplama.";

export const metadata = {
  title: "Hesaplama Araçları | Brütten Nete Maaş, Kıdem & İhbar Tazminatı",
  description: ARAC_ACIKLAMA,
  keywords: [
    "brütten nete maaş hesaplama",
    "netten brüte maaş hesaplama",
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı hesaplama",
    "fazla mesai hesaplama",
    "yıllık izin hesaplama",
    "maaş zammı hesaplama",
    "işveren maliyeti hesaplama",
    "2026 bordro hesaplama",
  ],
  alternates: { canonical: "https://ahikurumsal.com/araclar" },
  openGraph: {
    title: "Hesaplama Araçları | Ahikurumsal",
    description: ARAC_ACIKLAMA,
    url: "https://ahikurumsal.com/araclar",
    type: "website",
    siteName: "Ahikurumsal",
    locale: "tr_TR",
  },
};

const VARSAYILAN_TAVAN = 47228.43;

export default async function AraclarPage() {
  let kidemTavani = VARSAYILAN_TAVAN;
  let tavanTarihi: string | null = null;
  try {
    const data = await strapiGetSingle<{ tutar: number; gecerlilik_tarihi: string | null }>(
      "/kidem-tavan"
    );
    if (data?.tutar) {
      kidemTavani = data.tutar;
      tavanTarihi = data.gecerlilik_tarihi ?? null;
    }
  } catch {
    // Strapi'den çekilemezse varsayılan değer kullanılır
  }

  // Maaş hesaplama parametreleri — Strapi'de doldurulan alanlar varsayılanların
  // üzerine yazılır; erişilemezse koddaki güncel değerler kullanılır.
  let maasParams = mergeMaasParams(null);
  try {
    const mp = await strapiGetSingle<MaasParamStrapi>("/maas-parametre");
    maasParams = mergeMaasParams(mp);
  } catch {
    // Strapi'den çekilemezse varsayılan parametreler kullanılır
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Hesaplama Araçları</h1>
        <p className="mt-2 text-gray-500 mb-8">
          Brütten nete / netten brüte maaş, kıdem tazminatı, ihbar tazminatı,
          fazla mesai ve maaş zammı hesaplamaları. Sonuçlar bilgi amaçlıdır.
        </p>
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
          <span className="text-amber-500 text-base leading-snug flex-shrink-0">⚠</span>
          <p>
            Bu hesaplama aracı yalnızca bilgilendirme amacıyla sunulmaktadır ve
            elde edilen sonuçlar kesinlik taşımamaktadır. Karar almadan önce
            mutlaka uzman görüşüne başvurmanız önerilir.
          </p>
        </div>
      </div>

      <HesaplamaAraclari
        kidemTavani={kidemTavani}
        tavanTarihi={tavanTarihi}
        maasParams={maasParams}
      />

      <AraclarSeoIcerik />
    </div>
  );
}
