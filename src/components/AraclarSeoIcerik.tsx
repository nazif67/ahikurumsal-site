/**
 * /araclar sayfası SEO içeriği — arama motorlarının indexleyeceği açıklayıcı
 * metinler (nedir / nasıl hesaplanır) ve SSS + FAQPage yapısal verisi (JSON-LD).
 * Sunucu bileşenidir (statik metin), JS bundle'a yük bindirmez.
 */

const SSS: { soru: string; cevap: string }[] = [
  {
    soru: "Kıdem tazminatı nasıl hesaplanır?",
    cevap:
      "Kıdem tazminatı, çalışanın her tam hizmet yılı için 30 günlük brüt ücreti üzerinden hesaplanır. Bir yıldan artan süreler için de oranlı ödeme yapılır. Hesaplama, giydirilmiş brüt ücret (ikramiye, düzenli yardımlar dâhil) esas alınarak yapılır ve yasal kıdem tazminatı tavanını aşamaz. Kıdem tazminatı almaya hak kazanmak için aynı işverende en az 1 yıl çalışmış olmak gerekir.",
  },
  {
    soru: "2026 kıdem tazminatı tavanı ne kadar?",
    cevap:
      "Kıdem tazminatı tavanı her yıl ocak ve temmuz aylarında memur maaş katsayılarına göre güncellenir. Bir çalışanın yıllık kıdem tazminatı, o dönem geçerli olan tavan tutarını aşamaz. Aracımız güncel tavanı otomatik uygular; güncel tutarı hesaplama ekranında görebilirsiniz.",
  },
  {
    soru: "İhbar tazminatı kaç maaş / kaç gün olur?",
    cevap:
      "İhbar tazminatı çalışma süresine bağlıdır: 6 aydan az çalışanlar için 2 hafta, 6 ay–1,5 yıl arası için 4 hafta, 1,5–3 yıl arası için 6 hafta, 3 yıldan fazla çalışanlar için 8 haftalık brüt ücret tutarındadır. Bildirim süresine uymadan iş sözleşmesini fesheden taraf, karşı tarafa bu süreye ait ücreti öder.",
  },
  {
    soru: "Brütten nete maaş nasıl hesaplanır?",
    cevap:
      "Brüt ücretten önce %15 SGK ve işsizlik işçi payı (%14 SGK + %1 işsizlik) düşülür. Kalan tutar gelir vergisi matrahını oluşturur; bu matraha kümülatif olarak gelir vergisi dilimleri uygulanır ve asgari ücret gelir vergisi istisnası düşülür. Son olarak damga vergisi (asgari ücrete isabet eden kısmı istisna) çıkarılır. Geriye kalan tutar net (ele geçen) maaştır.",
  },
  {
    soru: "Aynı maaşta net ücret neden yıl içinde düşüyor?",
    cevap:
      "Gelir vergisi, yıl boyunca biriken (kümülatif) vergi matrahı üzerinden hesaplanır. Kümülatif matrah arttıkça çalışan bir üst gelir vergisi dilimine geçer (%15’ten %20’ye, sonra %27’ye…). Bu nedenle brüt ücret sabit kalsa bile yılın ilerleyen aylarında kesilen gelir vergisi artar ve net maaş bir miktar düşer. Aracımız 12 ayı ay ay hesaplayarak bu düşüşü tabloda gösterir.",
  },
  {
    soru: "İşveren maliyeti nasıl hesaplanır?",
    cevap:
      "Toplam işveren maliyeti; brüt ücrete ek olarak işveren SGK primi ve işveren işsizlik priminin eklenmesiyle bulunur. Teşvik durumuna göre işveren SGK oranı değişir: teşvik yoksa toplam yük yaklaşık %23,75, genel 5510 teşvikinde %21,75, imalat sektöründe ek 5 puan indirimle %18,75 seviyesindedir. Aracımız teşvik seçeneğine göre işveren maliyetini tabloda ayrıca gösterir.",
  },
  {
    soru: "Fazla mesai ücreti nasıl hesaplanır?",
    cevap:
      "Haftalık 45 saati aşan çalışmalar fazla mesai sayılır. Her fazla mesai saati için normal saatlik ücretin %50 fazlası ödenir. Saatlik ücret, aylık brüt ücretin 225’e bölünmesiyle (30 gün × 7,5 saat) bulunur. Fazla çalışma yıllık en fazla 270 saat olabilir.",
  },
  {
    soru: "Yıllık ücretli izin hakkı kaç gündür?",
    cevap:
      "İş Kanunu’na göre 1 yılını dolduran çalışanın yıllık izin hakkı kıdemine göre belirlenir: 1–5 yıl arası 14 iş günü, 5–15 yıl arası 20 iş günü, 15 yıl ve üzeri 26 iş günüdür. 18 yaşından küçük ve 50 yaşından büyük çalışanlara kıdemine bakılmaksızın en az 20 iş günü izin verilir.",
  },
];

const BOLUMLER: { baslik: string; icerik: React.ReactNode }[] = [
  {
    baslik: "Brütten Nete ve Netten Brüte Maaş Hesaplama",
    icerik: (
      <>
        <p>
          <strong>Brütten nete maaş hesaplama</strong> aracı, brüt ücretinizi
          girerek elinize geçecek net maaşı; <strong>netten brüte</strong> modu
          ise hedeflediğiniz net maaşa karşılık gelen brüt ücreti bulmanızı
          sağlar. Hesaplama, 2026 güncel mevzuatına göre SGK işçi payı (%14),
          işsizlik payı (%1), kümülatif gelir vergisi dilimleri, asgari ücret
          gelir vergisi istisnası ve damga vergisini dikkate alır.
        </p>
        <p>
          12 aylık giriş yaparak yıl boyunca kesintilerin ve net ücretin nasıl
          değiştiğini görebilir, ayrıca <strong>işveren maliyetini</strong> ve
          tüm bordro kırılımlarını tek tabloda inceleyebilir, sonuçları
          Excel’e aktarabilirsiniz.
        </p>
      </>
    ),
  },
  {
    baslik: "Kıdem Tazminatı Hesaplama",
    icerik: (
      <>
        <p>
          <strong>Kıdem tazminatı</strong>, belirli koşullarla işten ayrılan ve
          aynı işverende en az 1 yıl çalışmış işçiye ödenen bir tazminattır.
          Çalışanın her tam hizmet yılı için 30 günlük giydirilmiş brüt ücreti
          tutarında hesaplanır; yıldan artan süreler oranlanır. Ödenecek tutar
          yasal <strong>kıdem tazminatı tavanını</strong> aşamaz.
        </p>
        <p>
          <strong>Kıdem tazminatı hesaplama</strong> aracımızla brüt ücretinizi
          ve çalışma sürenizi (yıl ve ay) girerek tahmini kıdem tazminatınızı
          anında görebilirsiniz. Güncel tavan otomatik uygulanır.
        </p>
      </>
    ),
  },
  {
    baslik: "İhbar Tazminatı Hesaplama",
    icerik: (
      <p>
        <strong>İhbar tazminatı</strong>, iş sözleşmesini bildirim süresine
        uymadan fesheden tarafın karşı tarafa ödediği tazminattır. Süre çalışma
        kıdemine göre değişir: 6 aydan az için 2 hafta, 6 ay–1,5 yıl için 4
        hafta, 1,5–3 yıl için 6 hafta, 3 yıldan fazla için 8 haftalık brüt
        ücret. <strong>İhbar tazminatı hesaplama</strong> aracıyla kıdeminize
        göre bildirim sürenizi ve tutarı kolayca öğrenebilirsiniz.
      </p>
    ),
  },
  {
    baslik: "Fazla Mesai Hesaplama",
    icerik: (
      <p>
        Haftalık 45 saati aşan çalışmalar <strong>fazla mesai</strong> sayılır
        ve her saat için normal saatlik ücretin %50 fazlası ödenir. Saatlik
        ücret, aylık brüt ücretin 225’e bölünmesiyle bulunur. Yıllık fazla
        çalışma sınırı 270 saattir. <strong>Fazla mesai hesaplama</strong>
        aracıyla brüt ücretinizi ve fazla çalıştığınız saati girerek hak
        ettiğiniz ücreti hesaplayabilirsiniz.
      </p>
    ),
  },
  {
    baslik: "Maaş Zammı Hesaplama",
    icerik: (
      <p>
        <strong>Maaş zammı hesaplama</strong> aracı, mevcut brüt maaşınıza
        uygulanan zam oranını girerek zam sonrası brüt ve tahmini net maaşınızı
        gösterir. Böylece zammın net ücretinize gerçek yansımasını önceden
        görebilirsiniz.
      </p>
    ),
  },
  {
    baslik: "Yıllık İzin Hesaplama",
    icerik: (
      <p>
        <strong>Yıllık ücretli izin</strong> hakkı, 1 yılını dolduran
        çalışanın kıdemine göre belirlenir: 1–5 yıl için 14, 5–15 yıl için 20,
        15 yıl ve üzeri için 26 iş günü. 18 yaş altı ve 50 yaş üstü çalışanlara
        en az 20 iş günü izin verilir. <strong>Yıllık izin hesaplama</strong>
        aracıyla işe başlama tarihinizi girerek hak ettiğiniz ve kalan izin
        gününüzü öğrenebilirsiniz.
      </p>
    ),
  },
];

export default function AraclarSeoIcerik() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SSS.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="prose-content text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">
          Ücret, Tazminat ve İzin Hesaplama Araçları
        </h2>
        <p className="mt-3 text-gray-600">
          Ahikurumsal hesaplama araçları; brütten nete ve netten brüte maaş,
          kıdem tazminatı, ihbar tazminatı, fazla mesai, maaş zammı ve yıllık
          izin hesaplamalarını 2026 güncel mevzuatına göre ücretsiz olarak
          sunar. Aşağıda her aracın ne işe yaradığını ve nasıl hesaplandığını
          bulabilirsiniz.
        </p>

        {BOLUMLER.map((b) => (
          <div key={b.baslik} className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {b.baslik}
            </h3>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              {b.icerik}
            </div>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-gray-900 mt-12">
          Sıkça Sorulan Sorular
        </h2>
        <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
          {SSS.map((s) => (
            <details key={s.soru} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 list-none">
                {s.soru}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{s.cevap}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Bu araçlar ve içerikler yalnızca bilgilendirme amaçlıdır; kesin sonuç
          ve resmî işlemler için bir mali müşavir veya insan kaynakları uzmanına
          danışmanız önerilir.
        </p>
      </div>
    </section>
  );
}
