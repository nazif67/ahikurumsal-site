"use client";

import Link from "next/link";
import { useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const DIGER_ARACLAR = ["Brüt ↔ Net Maaş", "İhbar Tazminatı", "Fazla Mesai", "Maaş Zammı", "Yıllık İzin"];

export default function AraclarDemo({
  kidemTavani,
}: {
  kidemTavani: number;
}) {
  const [brut, setBrut] = useState("");
  const [yil, setYil] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function hesapla() {
    const b = parseFloat(brut) || 0;
    const y = parseFloat(yil) || 0;
    if (!b || !y) return;
    const gunluk = b / 30;
    setResult(Math.min(gunluk * 30, kidemTavani) * y);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand bg-brand/10 px-2.5 py-1 rounded-full">
          Canlı Demo
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-gray-900">
        Kıdem Tazminatı Hesapla
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Brüt maaşınızı ve çalışma yılınızı girin, tahmini tazminatınızı hemen görün.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Brüt Maaş (TL)
          </label>
          <input
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="30000"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Çalışma Yılı
          </label>
          <input
            type="number"
            value={yil}
            onChange={(e) => setYil(e.target.value)}
            placeholder="5"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <button
        onClick={hesapla}
        className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.99] transition-all"
      >
        Hesapla
      </button>

      {result !== null && (
        <div className="mt-4 rounded-xl bg-brand/5 border border-brand/15 px-4 py-3">
          <p className="text-xs text-gray-500">Tahmini Kıdem Tazminatı (Brüt)</p>
          <p className="mt-0.5 text-2xl font-bold text-brand">{fmt(result)} TL</p>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Diğer araçlar:</p>
        <div className="flex flex-wrap gap-1.5">
          {DIGER_ARACLAR.map((a) => (
            <span
              key={a}
              className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
        <Link
          href="/araclar"
          className="mt-4 inline-flex items-center text-sm font-medium text-brand hover:underline"
        >
          Tüm araçları kullan
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
