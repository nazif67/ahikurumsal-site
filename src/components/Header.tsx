"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/haberler", label: "Haberler" },
  { href: "/blog", label: "Blog" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/hazir-sablonlar", label: "Hazır Şablonlar" },
  { href: "/araclar", label: "Araçlar" },
  { href: "/sss", label: "SSS" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-shadow duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/ahikurumsal.jpg"
            alt="Ahikurumsal"
            width={72}
            height={72}
            className="rounded-xl object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-7 text-sm font-medium text-brand">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-brand hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menüyü aç/kapat"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-brand hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
