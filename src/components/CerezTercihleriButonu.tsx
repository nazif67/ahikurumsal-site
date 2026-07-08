"use client";

// Çerez Politikası sayfasında kullanıcıların önceki tercihlerini sıfırlayıp
// banner'ı yeniden açmasını sağlar.
export default function CerezTercihleriButonu() {
  const reset = () => {
    window.dispatchEvent(new Event("cookie-consent-reset"));
    // Sayfa en üste kaydırılırsa banner (altta) görünür kalır; gerek yok.
  };

  return (
    <button
      onClick={reset}
      className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      Çerez Tercihlerimi Değiştir
    </button>
  );
}
