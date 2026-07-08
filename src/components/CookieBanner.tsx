"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

const GA_ID = "G-XKXYLQSWDE";
const STORAGE_KEY = "cookie-consent";

type Consent = "accepted" | "rejected" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }

    // Çerez politikası sayfasındaki "tercihleri değiştir" düğmesi bu olayı tetikler
    const reopen = () => {
      localStorage.removeItem(STORAGE_KEY);
      setConsent(null);
    };
    window.addEventListener("cookie-consent-reset", reopen);
    return () => window.removeEventListener("cookie-consent-reset", reopen);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {/* Google Analytics YALNIZCA açık rıza verildiğinde yüklenir (KVKK/ePrivacy) */}
      {consent === "accepted" && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `,
            }}
          />
        </>
      )}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-2xl sm:flex sm:items-center sm:gap-6">
            <div className="flex-1 text-sm text-gray-600 leading-relaxed">
              <p className="font-semibold text-gray-900 mb-1">Çerez Kullanımı</p>
              Web sitemizde, deneyiminizi iyileştirmek ve ziyaret istatistiklerini
              ölçmek için zorunlu ve isteğe bağlı çerezler kullanıyoruz. Analitik
              çerezler yalnızca onayınızla çalışır. Ayrıntılar için{" "}
              <Link href="/cerez-politikasi" className="text-brand underline hover:opacity-80">
                Çerez Politikası
              </Link>{" "}
              ve{" "}
              <Link href="/kvkk-aydinlatma-metni" className="text-brand underline hover:opacity-80">
                Aydınlatma Metni
              </Link>
              ’ni inceleyebilirsiniz.
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0 sm:flex-shrink-0">
              <button
                onClick={() => choose("rejected")}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:flex-none"
              >
                Reddet
              </button>
              <button
                onClick={() => choose("accepted")}
                className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:flex-none"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
