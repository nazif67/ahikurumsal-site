import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ahikurumsal.com"),
  title: {
    default: "Ahikurumsal | İnsan Kaynakları Danışmanlığı",
    template: "%s | Ahikurumsal",
  },
  description: "İnsan kaynakları danışmanlığı, blog yazıları ve hesaplama araçları.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex min-h-screen flex-col bg-gray-50`}>
        {children}
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
