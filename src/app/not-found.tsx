import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-200">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Sayfa Bulunamadı</h2>
          <p className="mt-2 text-gray-500">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </body>
    </html>
  );
}
