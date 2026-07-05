"use client";

import { useState } from "react";
import {
  MaasParametreleri,
  VARSAYILAN_MAAS_PARAMS,
} from "@/lib/maasParametreleri";

/* ────────────────────────────────────────────────────────────────────────────
   Brütten Nete / Netten Brüte 12 aylık maaş + işveren maliyeti hesaplayıcı.
   Parametreler (asgari ücret, dilimler, oranlar...) `params` prop'undan gelir;
   verilmezse VARSAYILAN_MAAS_PARAMS kullanılır. Panelden yönetimi için bkz.
   src/lib/maasParametreleri.ts (verginet.net "Brütten Nete" mantığı baz alındı).
──────────────────────────────────────────────────────────────────────────── */

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const INPUT =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
const BTN =
  "bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all";

function fmt(n: number) {
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ─── Hesaplama tipleri ─────────────────────────────────────────────────────── */

type Opts = {
  engellilik: string;
  istisna: boolean;
  isverenSgkOran: number;
};

type AySonuc = {
  brut: number;
  sgkIsci: number; // SGK işçi payı (%14)
  issizlikIsci: number; // işsizlik işçi payı (%1)
  engellilikIndirimi: number; // aylık engellilik indirimi
  matrah: number; // aylık gelir vergisi matrahı
  kumMatrah: number; // kümülatif gelir vergisi matrahı
  gvHesaplanan: number; // istisnadan önce hesaplanan gelir vergisi
  gvIstisna: number; // asgari ücret gelir vergisi istisnası
  gelirVergisi: number; // ödenecek gelir vergisi (istisnadan sonra)
  damgaHesaplanan: number; // hesaplanan damga vergisi
  damgaIstisna: number; // asgari ücret damga vergisi istisnası
  damga: number; // ödenecek damga vergisi
  net: number; // net ele geçen
  sgkIsveren: number; // SGK işveren payı
  issizlikIsveren: number; // işsizlik işveren payı
  isverenMaliyeti: number; // toplam işveren maliyeti
  kumAsgari: number;
};

// Detaylı tablo + Excel dışa aktarma için ortak kolon tanımı.
// noToplam: yıllık toplam satırında toplanmaz (kümülatif değer).
type Kolon = { key: keyof AySonuc; label: string; vurgu?: boolean; noToplam?: boolean };
const KOLONLAR: Kolon[] = [
  { key: "brut", label: "Brüt" },
  { key: "sgkIsci", label: "SGK İşçi" },
  { key: "issizlikIsci", label: "İşsizlik" },
  { key: "engellilikIndirimi", label: "Engellilik İnd." },
  { key: "matrah", label: "GV Matrahı" },
  { key: "kumMatrah", label: "Küm. Matrah", noToplam: true },
  { key: "gvHesaplanan", label: "Hesap. GV" },
  { key: "gvIstisna", label: "GV İstisnası" },
  { key: "gelirVergisi", label: "Ödenecek GV" },
  { key: "damgaHesaplanan", label: "Hesap. Damga" },
  { key: "damgaIstisna", label: "Damga İstisnası" },
  { key: "damga", label: "Ödenecek Damga" },
  { key: "net", label: "Net", vurgu: true },
  { key: "sgkIsveren", label: "SGK İşveren" },
  { key: "issizlikIsveren", label: "İşsizlik İşv." },
  { key: "isverenMaliyeti", label: "Toplam Maliyet", vurgu: true },
];

/* ─── Bileşen ──────────────────────────────────────────────────────────────── */

export default function MaasHesaplama({
  params: P = VARSAYILAN_MAAS_PARAMS,
}: {
  params?: MaasParametreleri;
}) {
  // Kümülatif matrah üzerinden ödenecek toplam gelir vergisi
  function gelirVergisi(matrah: number): number {
    if (matrah <= 0) return 0;
    let vergi = 0;
    let onceki = 0;
    for (const d of P.dilimler) {
      if (matrah <= d.ust) {
        vergi += (matrah - onceki) * d.oran;
        break;
      }
      vergi += (d.ust - onceki) * d.oran;
      onceki = d.ust;
    }
    return vergi;
  }

  // Bir ayın bordrosu — önceki aylardan gelen kümülatif matrahlarla birlikte
  function ayHesapla(
    brut: number,
    kumMatrahOnce: number,
    kumAsgariOnce: number,
    opts: Opts
  ): AySonuc {
    const sgkMatrah = Math.min(brut, P.sgkTavan);
    const sgkIsci = sgkMatrah * P.sgkIsci;
    const issizlikIsci = sgkMatrah * P.issizlikIsci;
    const sgkKesinti = sgkIsci + issizlikIsci;

    const engIndirim = P.engellilik[opts.engellilik] || 0;
    let matrah = brut - sgkKesinti - engIndirim;
    if (matrah < 0) matrah = 0;

    const kumMatrahSonra = kumMatrahOnce + matrah;
    const gvHesaplanan = gelirVergisi(kumMatrahSonra) - gelirVergisi(kumMatrahOnce);

    // Asgari ücret gelir vergisi istisnası (kümülatif)
    let gvIstisna = 0;
    let kumAsgariSonra = kumAsgariOnce;
    if (opts.istisna) {
      const asgariMatrahAy = P.asgariBrut * (1 - P.sgkIsci - P.issizlikIsci);
      kumAsgariSonra = kumAsgariOnce + asgariMatrahAy;
      gvIstisna = gelirVergisi(kumAsgariSonra) - gelirVergisi(kumAsgariOnce);
    }
    // İstisna, hesaplanan vergiden fazla olamaz
    gvIstisna = Math.min(gvIstisna, gvHesaplanan);
    const gvOdenecek = gvHesaplanan - gvIstisna;

    // Damga vergisi (asgari ücrete isabet eden kısım istisna)
    const damgaHesaplanan = brut * P.damga;
    let damgaIstisna = opts.istisna ? P.asgariBrut * P.damga : 0;
    damgaIstisna = Math.min(damgaIstisna, damgaHesaplanan);
    const damgaOdenecek = damgaHesaplanan - damgaIstisna;

    const net = brut - sgkKesinti - gvOdenecek - damgaOdenecek;

    const sgkIsveren = sgkMatrah * opts.isverenSgkOran;
    const issizlikIsveren = sgkMatrah * P.issizlikIsveren;
    const isverenMaliyeti = brut + sgkIsveren + issizlikIsveren;

    return {
      brut,
      sgkIsci,
      issizlikIsci,
      engellilikIndirimi: engIndirim,
      matrah,
      kumMatrah: kumMatrahSonra,
      gvHesaplanan,
      gvIstisna,
      gelirVergisi: gvOdenecek,
      damgaHesaplanan,
      damgaIstisna,
      damga: damgaOdenecek,
      net,
      sgkIsveren,
      issizlikIsveren,
      isverenMaliyeti,
      kumAsgari: kumAsgariSonra,
    };
  }

  // Net → Brüt: hedef nete ulaşan brütü ikili arama ile bul
  function brutBul(
    hedefNet: number,
    kumMatrahOnce: number,
    kumAsgariOnce: number,
    opts: Opts
  ): number {
    let lo = hedefNet;
    let hi = hedefNet * 3 + 100000;
    for (let i = 0; i < 90; i++) {
      const mid = (lo + hi) / 2;
      const r = ayHesapla(mid, kumMatrahOnce, kumAsgariOnce, opts);
      if (r.net < hedefNet) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  const [mode, setMode] = useState<"brutten" | "netten">("brutten");
  const [ayniHerAy, setAyniHerAy] = useState(true);
  const [baslangicAy, setBaslangicAy] = useState(0); // 0 = Ocak
  const [tekTutar, setTekTutar] = useState("");
  const [aylik, setAylik] = useState<string[]>(Array(12).fill(""));

  const [engellilik, setEngellilik] = useState("0");
  const [istisna, setIstisna] = useState(true);
  const [tesvik, setTesvik] = useState("yok");

  const [rows, setRows] = useState<(AySonuc & { ay: string })[] | null>(null);
  const [hata, setHata] = useState("");

  function setAyDeger(i: number, v: string) {
    setAylik((prev) => {
      const kopya = [...prev];
      kopya[i] = v;
      return kopya;
    });
  }

  function hesapla() {
    setHata("");
    setRows(null);

    const opts: Opts = {
      engellilik,
      istisna,
      isverenSgkOran: P.isverenSgk[tesvik],
    };

    // Aktif aylar için değerleri topla
    const degerler: number[] = [];
    for (let i = baslangicAy; i < 12; i++) {
      const raw = ayniHerAy ? tekTutar : aylik[i];
      degerler.push(parseFloat(raw) || 0);
    }
    if (ayniHerAy && (parseFloat(tekTutar) || 0) <= 0) {
      setHata("Lütfen bir tutar girin.");
      return;
    }
    if (!degerler.some((d) => d > 0)) {
      setHata("Lütfen en az bir ay için tutar girin.");
      return;
    }

    let kumMatrah = 0;
    let kumAsgari = 0;
    const sonuc: (AySonuc & { ay: string })[] = [];

    for (let idx = 0; idx < degerler.length; idx++) {
      const ayIndex = baslangicAy + idx;
      const deger = degerler[idx];
      if (deger <= 0) continue;

      const brut =
        mode === "brutten"
          ? deger
          : brutBul(deger, kumMatrah, kumAsgari, opts);
      const r = ayHesapla(brut, kumMatrah, kumAsgari, opts);
      kumMatrah = r.kumMatrah;
      kumAsgari = r.kumAsgari;
      sonuc.push({ ...r, ay: AYLAR[ayIndex] });
    }

    setRows(sonuc);
  }

  const toplam = rows
    ? (() => {
        const t = {} as Record<keyof AySonuc, number>;
        for (const k of KOLONLAR) {
          if (k.noToplam) continue;
          t[k.key] = rows.reduce((s, r) => s + (r[k.key] as number), 0);
        }
        return t;
      })()
    : null;

  // Excel'de açılan CSV (Türkçe: noktalı virgül ayraç, virgüllü ondalık, UTF-8 BOM)
  function excelIndir() {
    if (!rows || !toplam) return;
    const csvSayi = (n: number) => n.toFixed(2).replace(".", ",");
    const basliklar = ["Ay", ...KOLONLAR.map((k) => k.label)];
    const satirlar = rows.map((r) => [
      r.ay,
      ...KOLONLAR.map((k) => csvSayi(r[k.key] as number)),
    ]);
    const toplamSatir = [
      "Yıllık Toplam",
      ...KOLONLAR.map((k) => (k.noToplam ? "" : csvSayi(toplam[k.key]))),
    ];
    const tumu = [basliklar, ...satirlar, toplamSatir];
    const icerik = "﻿" + tumu.map((s) => s.join(";")).join("\r\n");
    const blob = new Blob([icerik], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maas-hesaplama-${P.yil}-${mode === "brutten" ? "brutten-nete" : "netten-brute"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const tutarLabel = mode === "brutten" ? "Brüt" : "Net";

  return (
    <div className="space-y-6">
      <div className="max-w-4xl space-y-5">
      <p className="text-sm text-gray-500">
        {P.yil} güncel mevzuatına göre brütten nete / netten brüte 12 aylık maaş
        ve işveren maliyeti hesaplaması. Gelir vergisi{" "}
        <strong>kümülatif matrah</strong> üzerinden hesaplandığından, aynı brüt
        maaşta bile net ücret yıl içinde dilim atladıkça düşebilir.
      </p>

      {/* Brütten / Netten seçimi */}
      <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        <button
          onClick={() => setMode("brutten")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "brutten" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600"
          }`}
        >
          Brütten Nete
        </button>
        <button
          onClick={() => setMode("netten")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "netten" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600"
          }`}
        >
          Netten Brüte
        </button>
      </div>

      {/* Parametreler / işaretlemeler */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Başlangıç Ayı
          </label>
          <select
            value={baslangicAy}
            onChange={(e) => setBaslangicAy(parseInt(e.target.value))}
            className={INPUT}
          >
            {AYLAR.map((a, i) => (
              <option key={a} value={i}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Engellilik İndirimi
          </label>
          <select
            value={engellilik}
            onChange={(e) => setEngellilik(e.target.value)}
            className={INPUT}
          >
            <option value="0">Yok</option>
            <option value="1">1. derece (12.000 TL)</option>
            <option value="2">2. derece (7.000 TL)</option>
            <option value="3">3. derece (3.000 TL)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            İşveren SGK Teşviki
          </label>
          <select
            value={tesvik}
            onChange={(e) => setTesvik(e.target.value)}
            className={INPUT}
          >
            <option value="yok">Teşvik yok (%23,75)</option>
            <option value="genel">5510 genel teşvik (%21,75)</option>
            <option value="imalat">İmalat / 5 puan (%18,75)</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={istisna}
          onChange={(e) => setIstisna(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300"
        />
        Asgari ücret gelir vergisi ve damga vergisi istisnası uygulansın
        <span className="text-gray-400 text-xs">(standart çalışan için işaretli kalmalı)</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={ayniHerAy}
          onChange={(e) => setAyniHerAy(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300"
        />
        Aylık tutar tüm yıl aynı{" "}
        <span className="text-gray-400 text-xs">
          (kaldırırsan her ay ayrı girebilirsin)
        </span>
      </label>

      {/* Tutar girişi */}
      {ayniHerAy ? (
        <div className="max-w-xs">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Aylık {tutarLabel} Ücret (TL)
          </label>
          <input
            type="number"
            value={tekTutar}
            onChange={(e) => setTekTutar(e.target.value)}
            placeholder={mode === "brutten" ? "33030" : "28075"}
            className={INPUT}
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Aylık {tutarLabel} Ücretler (TL)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {AYLAR.map((a, i) =>
              i < baslangicAy ? null : (
                <div key={a}>
                  <span className="block text-[11px] text-gray-500 mb-0.5">{a}</span>
                  <input
                    type="number"
                    value={aylik[i]}
                    onChange={(e) => setAyDeger(i, e.target.value)}
                    placeholder="0"
                    className={INPUT}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      <button onClick={hesapla} className={BTN}>
        Hesapla
      </button>

      {hata && (
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <span className="flex-shrink-0">⚠</span>
          <p>{hata}</p>
        </div>
      )}
      </div>

      {rows && toplam && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-gray-500">
              Tüm kesinti ve istisna kırılımları aşağıdadır. Tabloyu yatay
              kaydırarak tüm sütunları görebilirsiniz.
            </p>
            <button
              onClick={excelIndir}
              className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-9 5.25A2.75 2.75 0 005.75 21h12.5A2.75 2.75 0 0021 18.25V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0014.5 3H5.75A2.75 2.75 0 003 5.75v12.5z" />
              </svg>
              Excel&apos;e Aktar
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-[11px] sm:text-xs min-w-[640px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 tracking-tight align-bottom">
                  <th className="text-left font-medium px-2 py-2 sticky left-0 bg-gray-50 z-10">
                    Ay
                  </th>
                  {KOLONLAR.map((k) => (
                    <th
                      key={k.key}
                      className={`text-right font-medium px-2 py-2 leading-tight ${
                        k.vurgu ? "text-blue-700" : ""
                      }`}
                    >
                      {k.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.ay} className="hover:bg-gray-50/60">
                    <td className="px-2 py-1.5 text-gray-700 font-medium sticky left-0 bg-white z-10">
                      {r.ay}
                    </td>
                    {KOLONLAR.map((k) => (
                      <td
                        key={k.key}
                        className={`px-2 py-1.5 text-right whitespace-nowrap tabular-nums ${
                          k.vurgu
                            ? "font-semibold text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        {fmt(r[k.key] as number)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50/60 font-semibold text-gray-800 border-t-2 border-blue-100">
                  <td className="px-2 py-2 sticky left-0 bg-blue-50 z-10">
                    Toplam
                  </td>
                  {KOLONLAR.map((k) => (
                    <td
                      key={k.key}
                      className={`px-2 py-2 text-right whitespace-nowrap tabular-nums ${
                        k.vurgu ? "text-blue-700" : ""
                      }`}
                    >
                      {k.noToplam ? "—" : fmt(toplam[k.key])}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            {P.yil} parametreleri: Brüt asgari ücret {fmt(P.asgariBrut)} TL · SGK
            işçi %{(P.sgkIsci * 100).toFixed(0)} + işsizlik %1 · damga %0,759 ·
            gelir vergisi dilimleri %15/20/27/35/40 · SGK tavanı {fmt(P.sgkTavan)}{" "}
            TL. İşveren maliyeti = Brüt + işveren SGK + işveren işsizlik. Gelir
            vergisi kümülatif matrah üzerinden hesaplanır. Sonuçlar
            bilgilendirme amaçlıdır; AGİ 2022&apos;de kaldırılmıştır.
          </p>
        </div>
      )}
    </div>
  );
}
