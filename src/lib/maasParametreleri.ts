/* ────────────────────────────────────────────────────────────────────────────
   MAAŞ HESAPLAMA PARAMETRELERİ
   Varsayılan değerler koda gömülüdür (aşağıda). Strapi'deki "maas-parametre"
   single type'ından gelen değerler bunların üzerine yazılır. Yani:
     • Strapi'de bir alanı doldurursan → o değer kullanılır.
     • Boş bırakırsan / Strapi erişilemezse → buradaki varsayılan kullanılır.
   Kaynak: 2026 asgari ücret tebliği, GVK 332 s. tebliğ, 5510 s. Kanun.
──────────────────────────────────────────────────────────────────────────── */

export type MaasParametreleri = {
  yil: number;
  asgariBrut: number; // aylık brüt asgari ücret
  sgkTavan: number; // SGK primine esas kazanç aylık üst sınırı
  sgkIsci: number; // SGK işçi payı (emeklilik + GSS)
  issizlikIsci: number; // işsizlik işçi payı
  issizlikIsveren: number; // işsizlik işveren payı
  damga: number; // damga vergisi oranı
  dilimler: { ust: number; oran: number }[]; // gelir vergisi dilimleri (kümülatif)
  isverenSgk: Record<string, number>; // işveren SGK payı (teşvik durumuna göre)
  engellilik: Record<string, number>; // aylık engellilik indirimi tutarları
};

// ── 2026 VARSAYILAN DEĞERLER ────────────────────────────────────────────────
export const VARSAYILAN_MAAS_PARAMS: MaasParametreleri = {
  yil: 2026,
  asgariBrut: 33030.0,
  sgkTavan: 297270.0,
  sgkIsci: 0.14,
  issizlikIsci: 0.01,
  issizlikIsveren: 0.02,
  damga: 0.00759,
  dilimler: [
    { ust: 190000, oran: 0.15 },
    { ust: 400000, oran: 0.2 },
    { ust: 1500000, oran: 0.27 },
    { ust: 5300000, oran: 0.35 },
    { ust: Infinity, oran: 0.4 },
  ],
  isverenSgk: {
    yok: 0.2175, // indirimsiz  → toplam işveren maliyeti +%23,75
    genel: 0.1975, // 5510 genel teşvik → +%21,75
    imalat: 0.1675, // imalat 5 puan → +%18,75
  },
  engellilik: { "0": 0, "1": 12000, "2": 7000, "3": 3000 },
};

// ── Strapi "maas-parametre" single type'ının düz alan yapısı ─────────────────
// (Strapi admin panelinde bu adlarla number alanları oluşturulur)
export type MaasParamStrapi = {
  yil?: number | null;
  asgari_brut?: number | null;
  sgk_tavan?: number | null;
  dilim1_ust?: number | null;
  dilim2_ust?: number | null;
  dilim3_ust?: number | null;
  dilim4_ust?: number | null;
  engellilik1?: number | null;
  engellilik2?: number | null;
  engellilik3?: number | null;
  isveren_sgk_yok?: number | null;
  isveren_sgk_genel?: number | null;
  isveren_sgk_imalat?: number | null;
};

const isNum = (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v);

// Strapi'den gelen değerleri varsayılanların üzerine yazar.
export function mergeMaasParams(s: MaasParamStrapi | null | undefined): MaasParametreleri {
  const d = VARSAYILAN_MAAS_PARAMS;
  if (!s) return d;
  return {
    ...d,
    yil: isNum(s.yil) ? s.yil : d.yil,
    asgariBrut: isNum(s.asgari_brut) ? s.asgari_brut : d.asgariBrut,
    sgkTavan: isNum(s.sgk_tavan) ? s.sgk_tavan : d.sgkTavan,
    dilimler: [
      { ust: isNum(s.dilim1_ust) ? s.dilim1_ust : d.dilimler[0].ust, oran: d.dilimler[0].oran },
      { ust: isNum(s.dilim2_ust) ? s.dilim2_ust : d.dilimler[1].ust, oran: d.dilimler[1].oran },
      { ust: isNum(s.dilim3_ust) ? s.dilim3_ust : d.dilimler[2].ust, oran: d.dilimler[2].oran },
      { ust: isNum(s.dilim4_ust) ? s.dilim4_ust : d.dilimler[3].ust, oran: d.dilimler[3].oran },
      { ust: Infinity, oran: d.dilimler[4].oran },
    ],
    isverenSgk: {
      yok: isNum(s.isveren_sgk_yok) ? s.isveren_sgk_yok : d.isverenSgk.yok,
      genel: isNum(s.isveren_sgk_genel) ? s.isveren_sgk_genel : d.isverenSgk.genel,
      imalat: isNum(s.isveren_sgk_imalat) ? s.isveren_sgk_imalat : d.isverenSgk.imalat,
    },
    engellilik: {
      "0": 0,
      "1": isNum(s.engellilik1) ? s.engellilik1 : d.engellilik["1"],
      "2": isNum(s.engellilik2) ? s.engellilik2 : d.engellilik["2"],
      "3": isNum(s.engellilik3) ? s.engellilik3 : d.engellilik["3"],
    },
  };
}
