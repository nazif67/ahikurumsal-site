import Link from "next/link";
import { strapiGetAll } from "@/lib/strapi";

export const revalidate = 60;

type Blog = { title: string; slug: string; excerpt: string; date: string };
type Duyuru = {
  title: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
  documentId: string;
};

const UZMANLIK = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "İşe Alım",
    desc: "İşe alım süreci tasarımı, mülakat teknikleri ve aday değerlendirme.",
    href: "/blog",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Özlük İşleri",
    desc: "Personel dosyaları, bordro süreçleri ve SGK işlemleri.",
    href: "/blog",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
      </svg>
    ),
    title: "İş Hukuku",
    desc: "İş kanunu mevzuatı, hak ve yükümlülükler hakkında güncel bilgiler.",
    href: "/haberler",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Yabancı Çalışma İzni",
    desc: "Yabancı uyruklu çalışanların izin süreçleri ve mevzuat rehberi.",
    href: "/haberler",
  },
];

const HERO_FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "İşe Alım & Seçme",
    desc: "Süreç tasarımı ve aday değerlendirme",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
      </svg>
    ),
    title: "İş Hukuku & Mevzuat",
    desc: "Güncel mevzuat ve yükümlülükler rehberi",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.756 4.5 4.972v6.057c0 1.017.625 1.927 1.587 2.246a24.756 24.756 0 006.413.818 24.756 24.756 0 006.413-.818c.962-.319 1.587-1.229 1.587-2.246V4.972c0-1.216-.807-2.272-1.907-2.4A48.32 48.32 0 0012 2.25z" />
      </svg>
    ),
    title: "Hesaplama Araçları",
    desc: "Tazminat, bordro ve SGK hesapları",
  },
];

export default async function HomePage() {
  const [latestPosts, latestDuyurular] = await Promise.all([
    strapiGetAll<Blog>("/blogs", {
      "pagination[pageSize]": 3,
      sort: "date:desc",
      fields: "title,slug,excerpt,date",
    }).catch(() => []),
    strapiGetAll<Duyuru>("/duyurular", {
      "pagination[pageSize]": 3,
      sort: "pinned:desc,date:desc",
      fields: "title,content,date,category,pinned",
    }).catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-brand-dark py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
                İnsan Kaynakları Uzmanlığı
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                İnsan Kaynakları
                <br />
                <span className="text-blue-200">Çözümleri &amp; Danışmanlık</span>
              </h1>
              <p className="mt-5 text-blue-100 max-w-lg leading-relaxed">
                İşe alım süreçleri, özlük işleri, iş hukuku ve tazminat
                hesaplamaları konularında uzman destek ve güncel bilgiler.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/araclar"
                  className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-blue-50 transition-colors text-sm"
                >
                  Hesaplama Araçları
                </Link>
                <Link
                  href="/iletisim"
                  className="rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20 transition-colors text-sm"
                >
                  İletişime Geç
                </Link>
                <Link
                  href="/blog"
                  className="rounded-lg border border-white/30 px-5 py-2.5 font-semibold text-white/80 hover:text-white hover:border-white/50 transition-colors text-sm"
                >
                  Blog
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-3 w-64 flex-shrink-0">
              {HERO_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-blue-200">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uzmanlık Alanları */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Uzmanlık Alanları</h2>
            <p className="text-gray-500 mt-2 text-sm">Deneyim ve bilgi birikimimizle desteklediğimiz alanlar</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {UZMANLIK.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand hover:shadow-lg transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-4 group-hover:bg-brand group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  İncele
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Son Duyurular */}
      {latestDuyurular.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Son Duyurular</h2>
                <p className="text-gray-500 text-sm mt-1">Güncel duyurular ve önemli bilgilendirmeler</p>
              </div>
              <Link href="/duyurular" className="text-sm font-medium text-brand hover:underline flex items-center gap-1">
                Tümünü gör
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {latestDuyurular.map((d) => (
                <div
                  key={d.title + d.date}
                  className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${d.pinned ? "bg-amber-400" : "bg-brand"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {d.category && (
                        <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                          {d.category}
                        </span>
                      )}
                      {d.pinned && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          Sabit
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{d.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{d.title}</h3>
                    {d.content && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{d.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Son Yazılar */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Son Yazılar</h2>
              <p className="text-gray-500 text-sm mt-1">Güncel İK içerikleri ve rehberler</p>
            </div>
            <Link href="/blog" className="text-sm font-medium text-brand hover:underline flex items-center gap-1">
              Tümünü gör
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {latestPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">Henüz yayınlanmış yazı yok.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:border-brand/30"
                >
                  <div className="w-8 h-1 rounded-full bg-brand mb-4 group-hover:w-12 transition-all duration-200" />
                  <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-brand">
                    Devamını oku
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hakkımda CTA */}
      <section className="bg-gradient-to-br from-brand to-brand-dark py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Birlikte Çalışalım</h2>
          <p className="text-blue-100 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            İnsan kaynakları alanındaki deneyimlerimi ve bilgilerimi sizinle paylaşmaktan memnuniyet duyarım.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/hakkimda"
              className="bg-white text-brand rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Hakkımda
            </Link>
            <Link
              href="/iletisim"
              className="border border-white/40 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
