import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import SoruBubble from "@/components/SoruBubble";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ahikurumsal.com"),
  title: {
    default: "Ahikurumsal | İnsan Kaynakları Danışmanlığı ve Hesaplama Araçları",
    template: "%s | Ahikurumsal",
  },
  description:
    "İnsan kaynakları danışmanlığı; iş hukuku ve mevzuat içerikleri, blog yazıları ve brütten nete maaş, kıdem & ihbar tazminatı gibi ücretsiz hesaplama araçları.",
  applicationName: "Ahikurumsal",
  openGraph: {
    type: "website",
    siteName: "Ahikurumsal",
    locale: "tr_TR",
    images: ["/ahikurumsal.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ahikurumsal.jpg"],
  },
  icons: {
    icon: [
      { url: "/ahikurumsal.jpg", type: "image/jpeg" },
    ],
    apple: "/ahikurumsal.jpg",
    shortcut: "/ahikurumsal.jpg",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ahikurumsal",
  url: "https://ahikurumsal.com",
  logo: "https://ahikurumsal.com/ahikurumsal.jpg",
  description:
    "İnsan kaynakları danışmanlığı, iş hukuku ve mevzuat içerikleri ile ücretsiz hesaplama araçları.",
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ahikurumsal",
  url: "https://ahikurumsal.com",
  inLanguage: "tr-TR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex min-h-screen flex-col bg-gray-50`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
        <SoruBubble />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XKXYLQSWDE"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XKXYLQSWDE');
            `,
          }}
        />
      </body>
    </html>
  );
}
