import { strapiGetSingle } from "@/lib/strapi";
import {
  mergeMaasParams,
  type MaasParamStrapi,
  type MaasParametreleri,
} from "@/lib/maasParametreleri";

const VARSAYILAN_TAVAN = 47228.43;

export type AraclarVeri = {
  kidemTavani: number;
  tavanTarihi: string | null;
  maasParams: MaasParametreleri;
};

/**
 * Hesaplama araçları için Strapi'den kıdem tavanı ve maaş parametrelerini çeker.
 * Hem /araclar hub'ı hem de /araclar/[arac] sayfaları kullanır.
 * Strapi'den çekilemezse koddaki güncel varsayılanlar kullanılır.
 */
export async function getAraclarVeri(): Promise<AraclarVeri> {
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
    // varsayılan kullanılır
  }

  let maasParams = mergeMaasParams(null);
  try {
    const mp = await strapiGetSingle<MaasParamStrapi>("/maas-parametre");
    maasParams = mergeMaasParams(mp);
  } catch {
    // varsayılan kullanılır
  }

  return { kidemTavani, tavanTarihi, maasParams };
}
