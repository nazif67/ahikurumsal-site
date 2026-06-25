import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/blog", label: "Blog" },
  { href: "/pratik-bilgiler", label: "Pratik Bilgiler" },
  { href: "/araclar", label: "Araçlar" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-brand">İK</span>
          <span className="text-lg font-semibold text-gray-900">Danışmanlık</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
