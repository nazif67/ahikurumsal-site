import Link from "next/link";
import { strapiGetAll, strapiGetSingle } from "@/lib/strapi";

export const revalidate = 60;

type Blog = { title: string; slug: string; excerpt: string; date: string };
type Duyuru = {
  title: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
};

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
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-blue-800 px-8 py-16 text-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative max-w-2xl">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            İnsan Kaynakları Uzmanlığı
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl leading-tight">
            İnsan Kaynakları
            <br />
            Çözümleri &amp; Danışmanlık
          </h1>
          <p className="mt-4 text-blue-100 max-w-lg leading-relaxed">
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
              href="/duyurular"
              className="rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20 transition-colors text-sm"
            >
              Duyurular
            </Link>
            <Link
              href="/blog"
              className="rounded-lg border border-white/40 px-5 py-2.5 font-semibold text-white hover:bg-white/10 transition-colors text-sm"
            >
              Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Uzmanlık Alanları */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Uzmanlık Alanları
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "👥",
              title: "İşe Alım",
              desc: "İşe alım süreci tasarımı, mülakat teknikleri ve aday değerlendirme.",
              href: "/blog",
            },
            {
              icon: "📋",
              title: "Özlük İşleri",
              desc: "Personel dosyaları, bordro süreçleri ve SGK işlemleri.",
              href: "/blog",
            },
            {
              icon: "⚖️",
              title: "İş Hukuku",
              desc: "İş kanunu mevzuatı, hak ve yükümlülükler hakkında güncel bilgiler.",
              href: "/pratik-bilgiler",
            },
            {
              icon: "🌍",
              title: "Yabancı Çalışma İzni",
              desc: "Yabancı uyruklu çalışanların izin süreçleri, başvuru ve mevzuat rehberi.",
              href: "/pratik-bilgiler",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-brand hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Son Duyurular */}
      {latestDuyurular.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Son Duyurular</h2>
            <Link
              href="/duyurular"
              className="text-sm font-medium text-brand hover:underline"
            >
              Tümünü gör →
            </Link>
          </div>
          <div className="space-y-3">
            {latestDuyurular.map((d) => (
              <div
                key={d.title + d.date}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5"
              >
                <div
                  className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                    d.pinned ? "bg-yellow-400" : "bg-brand"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {d.category}
                    </span>
                    <span className="text-xs text-gray-400">{d.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {d.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {d.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Son Yazılar */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Son Yazılar</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand hover:underline"
          >
            Tümünü gör →
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-gray-500">Henüz yayınlanmış yazı yok.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-blue-200"
              >
                <p className="text-xs text-gray-400">{post.date}</p>
                <h3 className="mt-2 font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Hakkımda CTA */}
      <section className="bg-white rounded-2xl p-8 text-center border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Hakkımda</h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          İnsan kaynakları alanındaki deneyimlerimi ve bilgilerimi burada
          paylaşıyorum.
        </p>
        <Link
          href="/hakkimda"
          className="mt-4 inline-block bg-brand text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          Daha Fazla Bilgi
        </Link>
      </section>
    </div>
  );
}
