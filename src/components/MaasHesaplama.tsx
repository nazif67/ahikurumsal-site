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
  sgkKesinti: number; // SGK işçi + işsizlik (%15)
  matrah: number;
  gelirVergisi: number;
  damga: number;
  net: number;
  isverenMaliyeti: number;
  kumMatrah: number;
  kumAsgari: number;
};

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
    const gvToplam = gelirVergisi(kumMatrahSonra) - gelirVergisi(kumMatrahOnce);

    // Asgari ücret gelir vergisi istisnası (kümülatif)
    let istisnaGV = 0;
    let kumAsgariSonra = kumAsgariOnce;
    if (opts.istisna) {
      const asgariMatrahAy = P.asgariBrut * (1 - P.sgkIsci - P.issizlikIsci);
      kumAsgariSonra = kumAsgariOnce + asgariMatrahAy;
      istisnaGV = gelirVergisi(kumAsgariSonra) - gelirVergisi(kumAsgariOnce);
    }
    const gvOdenecek = Math.max(0, gvToplam - istisnaGV);

    // Damga vergisi (asgari ücrete isabet eden kısım istisna)
    const damgaBrut = brut * P.damga;
    const damgaIstisna = opts.istisna ? P.asgariBrut * P.damga : 0;
    const damgaOdenecek = Math.max(0, damgaBrut - damgaIstisna);

    const net = brut - sgkKesinti - gvOdenecek - damgaOdenecek;

    const sgkIsveren = sgkMatrah * opts.isverenSgkOran;
    const issizlikIsveren = sgkMatrah * P.issizlikIsveren;
    const isverenMaliyeti = brut + sgkIsveren + issizlikIsveren;

    return {
      brut,
      sgkKesinti,
      matrah,
      gelirVergisi: gvOdenecek,
      damga: damgaOdenecek,
      net,
      isverenMaliyeti,
      kumMatrah: kumMatrahSonra,
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
    ? rows.reduce(
        (acc, r) => ({
          brut: acc.brut + r.brut,
          sgkKesinti: acc.sgkKesinti + r.sgkKesinti,
          gelirVergisi: acc.gelirVergisi + r.gelirVergisi,
          damga: acc.damga + r.damga,
          net: acc.net + r.net,
          isverenMaliyeti: acc.isverenMaliyeti + r.isverenMaliyeti,
        }),
        { brut: 0, sgkKesinti: 0, gelirVergisi: 0, damga: 0, net: 0, isverenMaliyeti: 0 }
      )
    : null;

  const tutarLabel = mode === "brutten" ? "Brüt" : "Net";

  return (
    <div className="space-y-5">
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

      {rows && toplam && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-3 py-2.5">Ay</th>
                  <th className="text-right font-medium px-3 py-2.5">Brüt</th>
                  <th className="text-right font-medium px-3 py-2.5">SGK+İşsizlik</th>
                  <th className="text-right font-medium px-3 py-2.5">Gelir V.</th>
                  <th className="text-right font-medium px-3 py-2.5">Damga V.</th>
                  <th className="text-right font-medium px-3 py-2.5 text-blue-700">
                    Net Ele Geçen
                  </th>
                  <th className="text-right font-medium px-3 py-2.5">İşveren Maliyeti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.ay} className="hover:bg-gray-50/60">
                    <td className="px-3 py-2 text-gray-700 font-medium">{r.ay}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{fmt(r.brut)}</td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {fmt(r.sgkKesinti)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {fmt(r.gelirVergisi)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">{fmt(r.damga)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-700">
                      {fmt(r.net)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {fmt(r.isverenMaliyeti)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50/60 font-semibold text-gray-800 border-t-2 border-blue-100">
                  <td className="px-3 py-2.5">Yıllık Toplam</td>
                  <td className="px-3 py-2.5 text-right">{fmt(toplam.brut)}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(toplam.sgkKesinti)}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(toplam.gelirVergisi)}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(toplam.damga)}</td>
                  <td className="px-3 py-2.5 text-right text-blue-700">{fmt(toplam.net)}</td>
                  <td className="px-3 py-2.5 text-right">{fmt(toplam.isverenMaliyeti)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            {P.yil} parametreleri: Brüt asgari ücret {fmt(P.asgariBrut)} TL · SGK
            işçi %{(P.sgkIsci * 100).toFixed(0)} + işsizlik %1 · damga %0,759 ·
            gelir vergisi dilimleri %15/20/27/35/40 · SGK tavanı {fmt(P.sgkTavan)}{" "}
            TL. İşveren maliyeti = Brüt + işveren SGK + işveren işsizlik. Sonuçlar
            bilgilendirme amaçlıdır; AGİ 2022'de kaldırılmıştır.
          </p>
        </div>
      )}
    </div>
  );
}
