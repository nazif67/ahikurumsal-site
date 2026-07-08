import Link from "next/link";
import Image from "next/image";

const NAV_COL = [
  { href: "/blog", label: "Blog" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/haberler", label: "Haberler" },
  { href: "/hazir-sablonlar", label: "Hazır Şablonlar" },
  { href: "/araclar", label: "Araçlar" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Image
              src="/ahikurumsal.jpg"
              alt="Ahikurumsal"
              width={151}
              height={48}
              className="h-12 w-auto rounded-lg object-contain"
            />
            <p className="mt-4 text-sm text-blue-200 leading-relaxed">
              İnsan kaynakları, iş hukuku, bordro ve SGK alanlarında uzman danışmanlık hizmetleri.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Sayfalar</p>
            <ul className="space-y-2.5">
              {NAV_COL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-blue-100 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">İletişim</p>
            <ul className="space-y-2.5 text-sm text-blue-100">
              <li>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  İletişim Formu
                </Link>
              </li>
              <li>
                <Link href="/hakkimda" className="hover:text-white transition-colors">
                  Hakkımda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-blue-300">
          © {year} Ahikurumsal. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
