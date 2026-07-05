import { strapiGetSingle, strapiGetAll } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import { aracBul, type Arac } from "@/lib/araclarData";
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

/* ─── Araç içeriği (Strapi override + kod fallback) ──────────────────────────
   Strapi "arac-icerik" koleksiyonunda ilgili slug için doldurulan alanlar,
   koddaki (araclarData.tsx) varsayılan içeriğin üzerine yazılır. Strapi boşsa
   ya da erişilemezse koddaki mevcut içerik kullanılır — hiçbir şey kaybolmaz. */

type AracIcerikStrapi = {
  slug: string;
  ad?: string | null;
  h1?: string | null;
  kart?: string | null;
  meta_baslik?: string | null;
  meta_aciklama?: string | null;
  keywords?: string | null; // virgülle ayrılmış
  icerik?: string | null; // markdown
  sss?: { soru?: string | null; cevap?: string | null }[] | null;
};

// Kodun sağladığı JSX içerik + (varsa) Strapi'den gelen HTML içerik birlikte.
export type CozulmusArac = Arac & { icerikHtml?: string };

const doluMu = (v: string | null | undefined): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function getArac(slug: string): Promise<CozulmusArac | undefined> {
  const base = aracBul(slug);
  if (!base) return undefined;

  let s: AracIcerikStrapi | undefined;
  try {
    const rows = await strapiGetAll<AracIcerikStrapi>("/arac-icerikler", {
      "filters[slug][$eq]": slug,
      populate: "sss",
    });
    s = rows[0];
  } catch {
    // Strapi yoksa kod fallback
  }

  if (!s) return base;

  const sssStrapi = (s.sss ?? [])
    .filter((x) => doluMu(x?.soru) && doluMu(x?.cevap))
    .map((x) => ({ soru: x.soru as string, cevap: x.cevap as string }));

  const merged: CozulmusArac = {
    ...base,
    ad: doluMu(s.ad) ? s.ad : base.ad,
    h1: doluMu(s.h1) ? s.h1 : base.h1,
    kart: doluMu(s.kart) ? s.kart : base.kart,
    metaBaslik: doluMu(s.meta_baslik) ? s.meta_baslik : base.metaBaslik,
    metaAciklama: doluMu(s.meta_aciklama) ? s.meta_aciklama : base.metaAciklama,
    keywords: doluMu(s.keywords)
      ? s.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : base.keywords,
    sss: sssStrapi.length > 0 ? sssStrapi : base.sss,
  };

  if (doluMu(s.icerik)) {
    merged.icerikHtml = await renderMarkdown(s.icerik);
  }

  return merged;
}
