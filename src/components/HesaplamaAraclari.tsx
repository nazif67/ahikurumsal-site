"use client";

import { useState } from "react";

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

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 border ${
        highlight ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`font-semibold mt-0.5 ${
          highlight ? "text-blue-700 text-lg" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Kıdem Tazminatı ──────────────────────────────────────────────────────────
function KidemCalc({ tavan, tavanTarihi }: { tavan: number; tavanTarihi: string | null }) {
  const [brut, setBrut] = useState("");
  const [yil, setYil] = useState("");
  const [ay, setAy] = useState("0");
  const [result, setResult] = useState<{
    sure: number;
    gunluk: number;
    tazminat: number;
    tavanAsildi: boolean;
  } | null>(null);

  function hesapla() {
    const b = parseFloat(brut) || 0;
    const y = parseInt(yil) || 0;
    const a = parseInt(ay) || 0;
    if (!b || (!y && !a)) return;
    const sure = y + a / 12;
    const gunluk = b / 30;
    const tavanAsildi = gunluk * 30 > tavan;
    setResult({
      sure,
      gunluk,
      tazminat: Math.min(gunluk * 30, tavan) * sure,
      tavanAsildi,
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Her tam çalışma yılı için 30 günlük brüt ücret ödenir (İş K. m.14).
      </p>

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-blue-800">
        <span className="font-medium">Güncel kıdem tavanı:</span>
        <span className="font-bold">{fmt(tavan)} TL/yıl</span>
        {tavanTarihi && (
          <span className="text-blue-500 text-xs ml-1">({tavanTarihi} itibarıyla)</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Brüt Aylık Ücret (TL)
          </label>
          <input
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="30000"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Yıl
          </label>
          <input
            type="number"
            min="0"
            value={yil}
            onChange={(e) => setYil(e.target.value)}
            placeholder="5"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Ay (0–11)
          </label>
          <input
            type="number"
            min="0"
            max="11"
            value={ay}
            onChange={(e) => setAy(e.target.value)}
            placeholder="0"
            className={INPUT}
          />
        </div>
      </div>
      <button onClick={hesapla} className={BTN}>
        Hesapla
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard
              label="Çalışma Süresi"
              value={`${result.sure.toFixed(2)} yıl`}
            />
            <ResultCard
              label="Günlük Brüt Ücret"
              value={`${fmt(result.gunluk)} TL`}
            />
            <ResultCard
              label="Kıdem Tazminatı (Brüt)"
              value={`${fmt(result.tazminat)} TL`}
              highlight
            />
          </div>
          {result.tavanAsildi && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
              ⚠ Hesaplamada tavan uygulandı: {fmt(tavan)} TL/yıl
            </p>
          )}
          <p className="text-xs text-gray-400">
            Formül: min(Günlük Brüt × 30, Tavan) × Yıl
          </p>
        </div>
      )}
    </div>
  );
}

// ─── İhbar Tazminatı ──────────────────────────────────────────────────────────
function ihbarGun(toplamAy: number): { gun: number; aciklama: string } {
  if (toplamAy < 6) return { gun: 14, aciklama: "6 aydan az → 2 hafta (14 gün)" };
  if (toplamAy <= 18) return { gun: 28, aciklama: "6 ay – 1,5 yıl → 4 hafta (28 gün)" };
  if (toplamAy <= 36) return { gun: 42, aciklama: "1,5 yıl – 3 yıl → 6 hafta (42 gün)" };
  return { gun: 56, aciklama: "3 yıldan fazla → 8 hafta (56 gün)" };
}

function IhbarCalc() {
  const [brut, setBrut] = useState("");
  const [yil, setYil] = useState("");
  const [ay, setAy] = useState("0");
  const [result, setResult] = useState<{
    gun: number;
    aciklama: string;
    gunluk: number;
    tazminat: number;
  } | null>(null);

  function hesapla() {
    const b = parseFloat(brut) || 0;
    const y = parseInt(yil) || 0;
    const a = parseInt(ay) || 0;
    if (!b || (!y && !a)) return;
    const { gun, aciklama } = ihbarGun(y * 12 + a);
    const gunluk = b / 30;
    setResult({ gun, aciklama, gunluk, tazminat: gunluk * gun });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Çalışma süresine göre bildirim süresi belirlenir; o günlük ücret üzerinden
        ödenir (İş K. m.17).
      </p>
      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
        <p>
          • 6 aydan az → <strong>2 hafta</strong> (14 gün)
        </p>
        <p>
          • 6 ay – 1,5 yıl → <strong>4 hafta</strong> (28 gün)
        </p>
        <p>
          • 1,5 yıl – 3 yıl → <strong>6 hafta</strong> (42 gün)
        </p>
        <p>
          • 3 yıldan fazla → <strong>8 hafta</strong> (56 gün)
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Brüt Aylık Ücret (TL)
          </label>
          <input
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="30000"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Yıl
          </label>
          <input
            type="number"
            min="0"
            value={yil}
            onChange={(e) => setYil(e.target.value)}
            placeholder="3"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Ay (0–11)
          </label>
          <input
            type="number"
            min="0"
            max="11"
            value={ay}
            onChange={(e) => setAy(e.target.value)}
            placeholder="6"
            className={INPUT}
          />
        </div>
      </div>
      <button onClick={hesapla} className={BTN}>
        Hesapla
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard label="Uygulanan Kural" value={result.aciklama} />
            <ResultCard
              label="Günlük Brüt Ücret"
              value={`${fmt(result.gunluk)} TL`}
            />
            <ResultCard
              label="İhbar Tazminatı (Brüt)"
              value={`${fmt(result.tazminat)} TL`}
              highlight
            />
          </div>
          <p className="text-xs text-gray-400">
            Formül: (Brüt / 30) × {result.gun} gün
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Fazla Mesai ──────────────────────────────────────────────────────────────
function FazlaMesaiCalc() {
  const [brut, setBrut] = useState("");
  const [saat, setSaat] = useState("");
  const [result, setResult] = useState<{
    saatlik: number;
    fazlaSaatlik: number;
    toplam: number;
  } | null>(null);

  function hesapla() {
    const b = parseFloat(brut) || 0;
    const s = parseFloat(saat) || 0;
    if (!b || !s) return;
    const saatlik = b / 225; // Brüt / (30 gün × 7,5 saat)
    setResult({ saatlik, fazlaSaatlik: saatlik * 1.5, toplam: saatlik * 1.5 * s });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Haftalık 45 saati aşan çalışmalar fazla mesai sayılır. Her saat için
        normal saatlik ücretin %50 fazlası ödenir (İş K. m.41). Yıllık yasal
        limit 270 saattir.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Brüt Aylık Ücret (TL)
          </label>
          <input
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="30000"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Fazla Mesai Saati (bu ay)
          </label>
          <input
            type="number"
            value={saat}
            onChange={(e) => setSaat(e.target.value)}
            placeholder="10"
            className={INPUT}
          />
        </div>
      </div>
      <button onClick={hesapla} className={BTN}>
        Hesapla
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard
              label="Normal Saatlik Ücret"
              value={`${fmt(result.saatlik)} TL`}
            />
            <ResultCard
              label="Fazla Mesai Saatlik Ücret (%50 fazla)"
              value={`${fmt(result.fazlaSaatlik)} TL`}
            />
            <ResultCard
              label="Toplam Fazla Mesai Ücreti"
              value={`${fmt(result.toplam)} TL`}
              highlight
            />
          </div>
          <p className="text-xs text-gray-400">
            Formül: (Brüt / 225) × 1,5 × Saat
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Maaş Zammı ───────────────────────────────────────────────────────────────
function netHesapla(brut: number): number {
  const sgk = brut * 0.15; // %15 SGK işçi payı (emeklilik %9 + sağlık %5 + işsizlik %1)
  const gvMatrah = brut - sgk;
  // 2026 aylık gelir vergisi dilimleri (ücret gelirleri tarifesi)
  const d1 = 190000 / 12;
  const d2 = 400000 / 12;
  const d3 = 1500000 / 12;
  const d4 = 5300000 / 12;
  let gv: number;
  if (gvMatrah <= d1) {
    gv = gvMatrah * 0.15;
  } else if (gvMatrah <= d2) {
    gv = d1 * 0.15 + (gvMatrah - d1) * 0.2;
  } else if (gvMatrah <= d3) {
    gv = d1 * 0.15 + (d2 - d1) * 0.2 + (gvMatrah - d2) * 0.27;
  } else if (gvMatrah <= d4) {
    gv = d1 * 0.15 + (d2 - d1) * 0.2 + (d3 - d2) * 0.27 + (gvMatrah - d3) * 0.35;
  } else {
    gv =
      d1 * 0.15 +
      (d2 - d1) * 0.2 +
      (d3 - d2) * 0.27 +
      (d4 - d3) * 0.35 +
      (gvMatrah - d4) * 0.4;
  }
  const dv = brut * 0.00759;
  return brut - sgk - gv - dv;
}

function MaasZammiCalc() {
  const [brut, setBrut] = useState("");
  const [oran, setOran] = useState("");
  const [result, setResult] = useState<{
    eskiBrut: number;
    yeniBrut: number;
    zamTutar: number;
    eskiNet: number;
    yeniNet: number;
    netArtis: number;
  } | null>(null);

  function hesapla() {
    const b = parseFloat(brut) || 0;
    const o = parseFloat(oran) || 0;
    if (!b || !o) return;
    const yeni = b * (1 + o / 100);
    setResult({
      eskiBrut: b,
      yeniBrut: yeni,
      zamTutar: yeni - b,
      eskiNet: netHesapla(b),
      yeniNet: netHesapla(yeni),
      netArtis: netHesapla(yeni) - netHesapla(b),
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Zam oranını girerek brüt ve tahmini net maaş değişimini hesaplayın.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Mevcut Brüt Maaş (TL)
          </label>
          <input
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="30000"
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Zam Oranı (%)
          </label>
          <input
            type="number"
            value={oran}
            onChange={(e) => setOran(e.target.value)}
            placeholder="20"
            className={INPUT}
          />
        </div>
      </div>
      <button onClick={hesapla} className={BTN}>
        Hesapla
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Mevcut
              </p>
              <ResultCard
                label="Brüt Maaş"
                value={`${fmt(result.eskiBrut)} TL`}
              />
              <ResultCard
                label="Tahmini Net"
                value={`${fmt(result.eskiNet)} TL`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Zamdan Sonra
              </p>
              <ResultCard
                label="Brüt Maaş"
                value={`${fmt(result.yeniBrut)} TL`}
                highlight
              />
              <ResultCard
                label="Tahmini Net"
                value={`${fmt(result.yeniNet)} TL`}
                highlight
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <ResultCard
              label="Brüt Artış"
              value={`+${fmt(result.zamTutar)} TL`}
            />
            <ResultCard
              label="Net Artış (tahmini)"
              value={`+${fmt(result.netArtis)} TL`}
              highlight
            />
          </div>
          <p className="text-xs text-gray-400">
            Net hesaplama tahminidir: SGK işçi %15 + 2026 gelir vergisi dilimleri
            + damga vergisi %0,759 (asgari ücret istisnası ve kümülatif matrah
            dikkate alınmaz)
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Yıllık İzin ──────────────────────────────────────────────────────────────
function calcHizmet(baslangic: Date, bitis: Date) {
  let yil = bitis.getFullYear() - baslangic.getFullYear();
  let ay = bitis.getMonth() - baslangic.getMonth();
  let gun = bitis.getDate() - baslangic.getDate();
  if (gun < 0) {
    ay--;
    gun += new Date(bitis.getFullYear(), bitis.getMonth(), 0).getDate();
  }
  if (ay < 0) { yil--; ay += 12; }
  return { yil, ay, gun };
}

function izinGunuHesapla(yil: number, yas: number | null): { gun: number; kural: string } {
  if (yas !== null && yas < 18) return { gun: 20, kural: "18 yaş altı — en az 20 iş günü" };
  if (yas !== null && yas >= 50) return { gun: 20, kural: "50 yaş ve üzeri — en az 20 iş günü" };
  if (yil <= 5) return { gun: 14, kural: "1–5 yıl kıdem (5 yıl dahil) — 14 iş günü" };
  if (yil < 15) return { gun: 20, kural: "5–15 yıl kıdem — 20 iş günü" };
  return { gun: 26, kural: "15 yıl ve üzeri kıdem — 26 iş günü" };
}

function YillikIzinCalc() {
  const today = new Date().toISOString().split("T")[0];
  const [baslangic, setBaslangic] = useState("");
  const [hesapTarih, setHesapTarih] = useState(today);
  const [dogumTarih, setDogumTarih] = useState("");
  const [brut, setBrut] = useState("");
  const [kullanilanGun, setKullanilanGun] = useState("");
  const [result, setResult] = useState<{
    sure: { yil: number; ay: number; gun: number };
    izinGun: number;
    kural: string;
    sonrakiHakedis: string;
    gunlukUcret: number | null;
    izinUcreti: number | null;
    kalanGun: number | null;
    yas: number | null;
  } | null>(null);
  const [hataMsg, setHataMsg] = useState("");

  function hesapla() {
    setHataMsg("");
    setResult(null);
    if (!baslangic || !hesapTarih) return;
    const b = new Date(baslangic);
    const h = new Date(hesapTarih);
    if (h <= b) {
      setHataMsg("Hesaplama tarihi işe başlama tarihinden sonra olmalıdır.");
      return;
    }
    const sure = calcHizmet(b, h);
    if (sure.yil < 1) {
      const hakedis = new Date(b);
      hakedis.setFullYear(b.getFullYear() + 1);
      setHataMsg(`Henüz yıllık izin hakkı kazanılmadı. 1 yıllık hak ediş tarihi: ${hakedis.toLocaleDateString("tr-TR")}`);
      return;
    }
    let yas: number | null = null;
    if (dogumTarih) {
      yas = calcHizmet(new Date(dogumTarih), h).yil;
    }
    const { gun, kural } = izinGunuHesapla(sure.yil, yas);
    const sonraki = new Date(b);
    sonraki.setFullYear(b.getFullYear() + sure.yil + 1);
    const gunlukUcret = brut ? parseFloat(brut) / 30 : null;
    const izinUcreti = gunlukUcret ? gunlukUcret * gun : null;
    const kullanilan = kullanilanGun ? parseInt(kullanilanGun) : null;
    const kalanGun = kullanilan !== null ? gun - kullanilan : null;
    setResult({ sure, izinGun: gun, kural, sonrakiHakedis: sonraki.toLocaleDateString("tr-TR"), gunlukUcret, izinUcreti, kalanGun, yas });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        İş Kanunu m.53 — 1 yılını tamamlayan çalışanlar kıdemine ve yaşına göre yıllık ücretli izne hak kazanır.
      </p>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-sm text-gray-600 space-y-1">
        <p>• 1–5 yıl kıdem → <strong>14 iş günü</strong></p>
        <p>• 5–15 yıl kıdem → <strong>20 iş günü</strong></p>
        <p>• 15 yıl ve üzeri → <strong>26 iş günü</strong></p>
        <p className="font-medium" style={{ color: "#1e3a8a" }}>• 18 yaş altı veya 50 yaş ve üzeri → en az <strong>20 iş günü</strong></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">İşe Başlama Tarihi</label>
          <input type="date" value={baslangic} onChange={(e) => setBaslangic(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hesaplama Tarihi</label>
          <input type="date" value={hesapTarih} onChange={(e) => setHesapTarih(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Doğum Tarihi <span className="font-normal text-gray-400">(yaş kontrolü için)</span>
          </label>
          <input type="date" value={dogumTarih} onChange={(e) => setDogumTarih(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Kullanılan İzin Günü <span className="font-normal text-gray-400">(kalan için)</span>
          </label>
          <input type="number" min="0" value={kullanilanGun} onChange={(e) => setKullanilanGun(e.target.value)} placeholder="0" className={INPUT} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Brüt Aylık Ücret (TL) <span className="font-normal text-gray-400">(izin ücreti için)</span>
          </label>
          <input type="number" value={brut} onChange={(e) => setBrut(e.target.value)} placeholder="30000" className={INPUT} />
        </div>
      </div>

      <button onClick={hesapla} className={BTN}>Hesapla</button>

      {hataMsg && (
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <span className="flex-shrink-0">⚠</span>
          <p>{hataMsg}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              label="Hizmet Süresi"
              value={`${result.sure.yil} yıl ${result.sure.ay} ay`}
            />
            <ResultCard
              label="Yıllık İzin Hakkı"
              value={`${result.izinGun} iş günü`}
              highlight
            />
            {result.kalanGun !== null && (
              <ResultCard
                label="Kalan İzin"
                value={`${result.kalanGun} iş günü`}
                highlight={result.kalanGun > 0}
              />
            )}
            <ResultCard label="Sonraki Hak Ediş" value={result.sonrakiHakedis} />
          </div>

          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium" style={{ background: "rgba(30,58,138,0.06)", color: "#1e3a8a", border: "1px solid rgba(30,58,138,0.15)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {result.kural}
            {result.yas !== null && (
              <span className="font-normal text-gray-500 ml-1">(yaş: {result.yas})</span>
            )}
          </div>

          {result.gunlukUcret && result.izinUcreti && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <ResultCard label="Günlük Brüt Ücret" value={`${fmt(result.gunlukUcret)} TL`} />
              <ResultCard label="İzin Ücreti (Brüt)" value={`${fmt(result.izinUcreti)} TL`} highlight />
            </div>
          )}
          <p className="text-xs text-gray-400">
            İş K. m.53 — İzin günleri iş günü bazlıdır; hafta tatili ve resmi tatiller izin süresine dahil değildir.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tab wrapper ───────────────────────────────────────────────────────────────
import React from "react";
import MaasHesaplama from "./MaasHesaplama";
import type { MaasParametreleri } from "@/lib/maasParametreleri";

const TAB_IDS = ["maasHesap", "kidem", "ihbar", "fazlaMesai", "maasZammi", "yillikIzin"] as const;
const TAB_LABELS: Record<string, string> = {
  maasHesap: "Brüt ↔ Net Maaş",
  kidem: "Kıdem Tazminatı",
  ihbar: "İhbar Tazminatı",
  fazlaMesai: "Fazla Mesai",
  maasZammi: "Maaş Zammı",
  yillikIzin: "Yıllık İzin",
};

export default function HesaplamaAraclari({
  kidemTavani,
  tavanTarihi,
  maasParams,
}: {
  kidemTavani: number;
  tavanTarihi: string | null;
  maasParams?: MaasParametreleri;
}) {
  const [activeTab, setActiveTab] = useState("maasHesap");

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {TAB_LABELS[activeTab]}
        </h2>
        {activeTab === "maasHesap" && <MaasHesaplama params={maasParams} />}
        {activeTab === "kidem" && <KidemCalc tavan={kidemTavani} tavanTarihi={tavanTarihi} />}
        {activeTab === "ihbar" && <IhbarCalc />}
        {activeTab === "fazlaMesai" && <FazlaMesaiCalc />}
        {activeTab === "maasZammi" && <MaasZammiCalc />}
        {activeTab === "yillikIzin" && <YillikIzinCalc />}
      </div>
    </div>
  );
}
