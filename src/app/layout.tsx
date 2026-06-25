import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "İK Danışmanlık",
    template: "%s | İK Danışmanlık",
  },
  description: "İnsan kaynakları danışmanlığı, blog yazıları ve hesaplama araçları.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col bg-gray-50">{children}</body>
    </html>
  );
}
