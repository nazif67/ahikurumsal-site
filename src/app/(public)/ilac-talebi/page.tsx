import IlacForm from "./IlacForm";

export const metadata = {
  title: "İlaç Talebi",
  robots: { index: false, follow: false },
};

export default function IlacTalebiPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">İlaç Talebi</h1>
      <p className="text-gray-500 mb-10">
        Kullanmanız gereken ilaç(lar) için ad soyad ve ilaç isimlerini girin. Talebiniz doktorumuza iletilecektir.
      </p>

      <IlacForm />
    </div>
  );
}
