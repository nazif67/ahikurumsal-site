const UYGULAMA_URL = "https://admin.ahikurumsal.com";

const MODULLER = [
  {
    title: "QR Giriş-Çıkış (PDKS)",
    desc: "Zaman sınırlı QR kod, GPS ve IP doğrulamasıyla güvenli personel giriş-çıkışı.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    ),
  },
  {
    title: "İzin Takip Sistemi",
    desc: "İzin talebi, onay akışı ve bakiye takibini tek ekrandan yönetin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
  },
  {
    title: "Görev Yönetimi",
    desc: "Çalışanlara görev atayın, takip edin ve tamamlanma durumunu izleyin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Dijital İK & Personel",
    desc: "Çalışan özlük dosyaları, şube ve departman yönetimi dijital ortamda.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Evrak & Karar Yönetimi",
    desc: "Gelen-giden evrak, kurul kararları ve resmi yazışmalar tek arşivde.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Araç, Demirbaş & Satın Alma",
    desc: "Kurum araçları, konutlar, demirbaşlar ve satın alma süreçleri kontrol altında.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

export default function IKYazilimTanitim() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark shadow-xl">
          <div className="grid lg:grid-cols-5">
            {/* Sol: mesaj + CTA */}
            <div className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 self-start bg-emerald-400/20 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                Ücretsiz
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Ücretsiz İK &amp; PDKS Yazılımımızı Denediniz mi?
              </h2>
              <p className="mt-4 text-blue-100 leading-relaxed text-sm">
                QR kod ile personel giriş-çıkışı, izin takibi, görev yönetimi ve
                kurum yönetimini tek platformda toplayan Ahikurumsal İK
                yazılımını ücretsiz kullanmaya hemen başlayın.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={UYGULAMA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-blue-50 transition-colors text-sm inline-flex items-center gap-2"
                >
                  Ücretsiz Dene
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
              <p className="mt-4 text-xs text-blue-200/80">
                Kurulum gerektirmez · Web tabanlı · Kredi kartı istenmez
              </p>
            </div>

            {/* Sağ: modül kartları */}
            <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULLER.map((m) => (
                  <div
                    key={m.title}
                    className="rounded-xl bg-white/10 border border-white/15 p-4 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-white">
                      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                        {m.icon}
                      </span>
                      <h3 className="font-semibold text-sm leading-snug">{m.title}</h3>
                    </div>
                    <p className="mt-2 text-xs text-blue-100/90 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
