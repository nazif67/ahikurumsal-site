"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h2 className="text-xl font-semibold text-gray-800">Bir sorun oluştu</h2>
          <p className="mt-2 text-gray-500">Sayfa yüklenirken beklenmeyen bir hata meydana geldi.</p>
          <button
            onClick={() => reset()}
            className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
