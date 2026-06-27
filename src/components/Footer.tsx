export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
        <p>© {year} Ahikurumsal. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
