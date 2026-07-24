import Link from "next/link";
import IlacForm from "./IlacForm";

export const metadata = {
  title: "İlaç Talebi",
  robots: { index: false, follow: false },
};

export default function IlacTalebiPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        ← Ana Sayfaya Dön
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">İlaç Talebi</h1>
      <p className="text-gray-500 mb-10">
        Kullanmanız gereken ilaç(lar) için ad soyad ve ilaç isimlerini girin. Talebiniz doktorumuza iletilecektir.
      </p>

      <IlacForm />
    </div>
  );
}
