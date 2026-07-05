import type { ReactNode } from "react";

/**
 * Her hesaplama aracının SEO verisi — hem /araclar hub'ı hem de her araca
 * özel /araclar/[slug] sayfası bu tek kaynaktan beslenir.
 * tabId: HesaplamaAraclari bileşeni içindeki sekme kimliği.
 */

export type AracSSS = { soru: string; cevap: string };

export type Arac = {
  slug: string;
  tabId: string;
  ad: string; // kısa ad (kart, breadcrumb, menü)
  h1: string; // sayfa başlığı
  kart: string; // kart/liste açıklaması
  metaBaslik: string;
  metaAciklama: string;
  keywords: string[];
  icerik: ReactNode; // detaylı SEO metni
  sss: AracSSS[];
};

export const ARACLAR: Arac[] = [
  {
    slug: "brutten-nete-maas-hesaplama",
    tabId: "maasHesap",
    ad: "Brütten Nete / Netten Brüte Maaş",
    h1: "Brütten Nete ve Netten Brüte Maaş Hesaplama (2026)",
    kart: "Brüt maaştan net ele geçeni, net maaştan brütü ve işveren maliyetini 12 ay bazında hesaplayın.",
    metaBaslik: "Brütten Nete Maaş Hesaplama 2026 | Netten Brüte & İşveren Maliyeti",
    metaAciklama:
      "2026 güncel mevzuatına göre brütten nete ve netten brüte maaş hesaplama. SGK, gelir vergisi, damga vergisi kesintileri, asgari ücret istisnası ve işveren maliyeti 12 aylık tabloda.",
    keywords: [
      "brütten nete maaş hesaplama",
      "netten brüte maaş hesaplama",
      "2026 maaş hesaplama",
      "net maaş hesaplama",
      "işveren maliyeti hesaplama",
      "bordro hesaplama",
    ],
    icerik: (
      <>
        <p>
          <strong>Brütten nete maaş hesaplama</strong> aracı, brüt ücretinizi
          girerek elinize geçecek net maaşı; <strong>netten brüte</strong> modu
          ise hedeflediğiniz net maaşa karşılık gelen brüt ücreti bulmanızı
          sağlar. Hesaplama 2026 güncel mevzuatına göre yapılır; SGK işçi payı
          (%14), işsizlik payı (%1), kümülatif gelir vergisi dilimleri, asgari
          ücret gelir vergisi istisnası ve damga vergisi dikkate alınır.
        </p>
        <p>
          Aracın en güçlü yanı, <strong>12 aylık</strong> hesaplama yapmasıdır.
          Gelir vergisi yıl boyunca biriken (kümülatif) matrah üzerinden
          hesaplandığından, brüt maaş sabit kalsa bile net ücret yılın ilerleyen
          aylarında dilim atladıkça düşebilir. Araç bu değişimi ay ay tabloda
          gösterir, ayrıca <strong>işveren maliyetini</strong> (teşvik seçenekli)
          ve tüm bordro kırılımlarını sunar. Sonuçları Excel’e
          aktarabilirsiniz.
        </p>
      </>
    ),
    sss: [
      {
        soru: "Brütten nete maaş nasıl hesaplanır?",
        cevap:
          "Brüt ücretten önce %15 SGK ve işsizlik işçi payı (%14 SGK + %1 işsizlik) düşülür. Kalan tutar gelir vergisi matrahını oluşturur; bu matraha kümülatif gelir vergisi dilimleri uygulanır ve asgari ücret gelir vergisi istisnası düşülür. Son olarak damga vergisi (asgari ücrete isabet eden kısmı istisna) çıkarılır. Geriye kalan tutar net ele geçen maaştır.",
      },
      {
        soru: "Aynı maaşta net ücret neden yıl içinde düşüyor?",
        cevap:
          "Gelir vergisi yıl boyunca biriken kümülatif matrah üzerinden hesaplanır. Matrah arttıkça çalışan bir üst gelir vergisi dilimine geçer (%15’ten %20’ye, sonra %27’ye…). Bu nedenle brüt sabit olsa bile ilerleyen aylarda gelir vergisi artar ve net maaş bir miktar düşer.",
      },
      {
        soru: "İşveren maliyeti nasıl hesaplanır?",
        cevap:
          "Toplam işveren maliyeti; brüt ücrete işveren SGK primi ve işveren işsizlik priminin eklenmesiyle bulunur. Teşvik yoksa toplam yük yaklaşık %23,75, genel 5510 teşvikinde %21,75, imalat sektöründe %18,75 seviyesindedir.",
      },
    ],
  },
  {
    slug: "kidem-tazminati-hesaplama",
    tabId: "kidem",
    ad: "Kıdem Tazminatı",
    h1: "Kıdem Tazminatı Hesaplama (2026)",
    kart: "Çalışma sürenize ve brüt maaşınıza göre kıdem tazminatınızı tavan uygulamasıyla hesaplayın.",
    metaBaslik: "Kıdem Tazminatı Hesaplama 2026 | Güncel Tavan ile",
    metaAciklama:
      "Kıdem tazminatı hesaplama aracı: brüt maaş ve çalışma sürenizi girin, güncel kıdem tazminatı tavanı uygulanarak tahmini tutarı anında görün.",
    keywords: [
      "kıdem tazminatı hesaplama",
      "kıdem tazminatı nasıl hesaplanır",
      "2026 kıdem tazminatı tavanı",
      "kıdem tazminatı ne kadar",
    ],
    icerik: (
      <>
        <p>
          <strong>Kıdem tazminatı</strong>, iş sözleşmesi belirli koşullarla
          sona eren ve aynı işverende en az 1 yıl çalışmış işçiye ödenen bir
          tazminattır. Çalışanın her tam hizmet yılı için 30 günlük giydirilmiş
          brüt ücreti tutarında hesaplanır; bir yıldan artan süreler oranlanır.
          Ödenecek yıllık tutar, yasal <strong>kıdem tazminatı tavanını</strong>{" "}
          aşamaz.
        </p>
        <p>
          <strong>Kıdem tazminatı hesaplama</strong> aracımızla brüt aylık
          ücretinizi ve çalışma sürenizi (yıl ve ay) girerek tahmini kıdem
          tazminatınızı anında görebilirsiniz. Güncel tavan otomatik uygulanır;
          brütünüz tavanı aşarsa hesaplamada bu durum belirtilir.
        </p>
      </>
    ),
    sss: [
      {
        soru: "Kıdem tazminatı nasıl hesaplanır?",
        cevap:
          "Her tam hizmet yılı için 30 günlük giydirilmiş brüt ücret esas alınır; yıldan artan süreler oranlanır. Hesaplanan tutar dönemin yasal kıdem tazminatı tavanını aşamaz. Kıdem tazminatına hak kazanmak için aynı işverende en az 1 yıl çalışmış olmak gerekir.",
      },
      {
        soru: "2026 kıdem tazminatı tavanı ne kadar?",
        cevap:
          "Kıdem tazminatı tavanı her yıl ocak ve temmuz aylarında memur maaş katsayılarına göre güncellenir. Bir çalışanın yıllık kıdem tazminatı o dönem geçerli tavanı aşamaz. Aracımız güncel tavanı otomatik uygular ve hesaplama ekranında gösterir.",
      },
      {
        soru: "Kıdem tazminatı kimlere ödenir?",
        cevap:
          "Aynı işverende en az 1 yıl çalışan işçiye; işveren tarafından haklı neden dışında fesih, işçinin haklı nedenle feshi, askerlik, emeklilik, evlilik (kadın işçi için 1 yıl içinde) ve ölüm gibi durumlarda kıdem tazminatı ödenir.",
      },
    ],
  },
  {
    slug: "ihbar-tazminati-hesaplama",
    tabId: "ihbar",
    ad: "İhbar Tazminatı",
    h1: "İhbar Tazminatı Hesaplama (2026)",
    kart: "Kıdeminize göre bildirim sürenizi ve ihbar tazminatı tutarını hesaplayın.",
    metaBaslik: "İhbar Tazminatı Hesaplama 2026 | Bildirim Süresi ve Tutar",
    metaAciklama:
      "İhbar tazminatı hesaplama aracı: çalışma sürenize göre bildirim süresini (2–8 hafta) ve brüt ücret üzerinden ihbar tazminatı tutarını hesaplayın.",
    keywords: [
      "ihbar tazminatı hesaplama",
      "ihbar tazminatı kaç gün",
      "ihbar süresi hesaplama",
      "ihbar tazminatı nasıl hesaplanır",
    ],
    icerik: (
      <>
        <p>
          <strong>İhbar tazminatı</strong>, iş sözleşmesini yasal bildirim
          süresine uymadan fesheden tarafın karşı tarafa ödediği tazminattır.
          Bildirim süresi çalışma kıdemine göre değişir: 6 aydan az için 2 hafta,
          6 ay–1,5 yıl için 4 hafta, 1,5–3 yıl için 6 hafta, 3 yıldan fazla için
          8 haftalık brüt ücret.
        </p>
        <p>
          <strong>İhbar tazminatı hesaplama</strong> aracıyla brüt aylık
          ücretinizi ve çalışma sürenizi girerek uygulanacak bildirim süresini ve
          ödenecek/alacak tutarı kolayca öğrenebilirsiniz.
        </p>
      </>
    ),
    sss: [
      {
        soru: "İhbar tazminatı kaç gün / kaç hafta olur?",
        cevap:
          "Çalışma süresine bağlıdır: 6 aydan az için 2 hafta, 6 ay–1,5 yıl için 4 hafta, 1,5–3 yıl için 6 hafta, 3 yıldan fazla için 8 haftalık brüt ücret tutarındadır.",
      },
      {
        soru: "İhbar tazminatını kim öder?",
        cevap:
          "Bildirim süresine uymadan iş sözleşmesini fesheden taraf (işveren ya da işçi) karşı tarafa ihbar tazminatı öder. Yani hem işçi hem işveren duruma göre ihbar tazminatı ödeyebilir.",
      },
      {
        soru: "İhbar tazminatı ile kıdem tazminatı aynı mı?",
        cevap:
          "Hayır. Kıdem tazminatı çalışma yılına göre 30 günlük ücret esasına dayanır ve tavan uygulanır. İhbar tazminatı ise bildirim süresine uyulmamasının karşılığıdır ve tavan uygulanmaz.",
      },
    ],
  },
  {
    slug: "fazla-mesai-hesaplama",
    tabId: "fazlaMesai",
    ad: "Fazla Mesai",
    h1: "Fazla Mesai Ücreti Hesaplama (2026)",
    kart: "Brüt maaşınıza göre %50 zamlı fazla mesai saat ücretinizi ve toplam tutarı hesaplayın.",
    metaBaslik: "Fazla Mesai Hesaplama 2026 | %50 Zamlı Saat Ücreti",
    metaAciklama:
      "Fazla mesai hesaplama aracı: brüt maaş ve fazla çalışılan saati girin, %50 zamlı fazla mesai saat ücretini ve toplam fazla mesai ücretini hesaplayın.",
    keywords: [
      "fazla mesai hesaplama",
      "fazla mesai ücreti nasıl hesaplanır",
      "fazla mesai saat ücreti",
      "mesai ücreti hesaplama",
    ],
    icerik: (
      <p>
        Haftalık 45 saati aşan çalışmalar <strong>fazla mesai</strong> sayılır ve
        her fazla mesai saati için normal saatlik ücretin %50 fazlası ödenir.
        Saatlik ücret, aylık brüt ücretin 225’e bölünmesiyle (30 gün × 7,5 saat)
        bulunur; yıllık fazla çalışma sınırı 270 saattir.{" "}
        <strong>Fazla mesai hesaplama</strong> aracıyla brüt ücretinizi ve fazla
        çalıştığınız saati girerek hak ettiğiniz ücreti hesaplayabilirsiniz.
      </p>
    ),
    sss: [
      {
        soru: "Fazla mesai ücreti nasıl hesaplanır?",
        cevap:
          "Saatlik ücret aylık brüt ücretin 225’e bölünmesiyle bulunur. Her fazla mesai saati için bu ücretin %50 fazlası (1,5 katı) ödenir. Toplam fazla mesai ücreti = saatlik ücret × 1,5 × fazla mesai saati.",
      },
      {
        soru: "Yılda en fazla kaç saat fazla mesai yapılabilir?",
        cevap:
          "İş Kanunu’na göre fazla çalışma süresi yılda 270 saati aşamaz. Ayrıca fazla mesai için işçinin yazılı onayı gerekir.",
      },
    ],
  },
  {
    slug: "maas-zammi-hesaplama",
    tabId: "maasZammi",
    ad: "Maaş Zammı",
    h1: "Maaş Zammı Hesaplama (2026)",
    kart: "Zam oranını girin, zam sonrası brüt ve tahmini net maaşınızı görün.",
    metaBaslik: "Maaş Zammı Hesaplama 2026 | Zam Sonrası Net Maaş",
    metaAciklama:
      "Maaş zammı hesaplama aracı: mevcut brüt maaş ve zam oranını girin, zam sonrası brüt ve tahmini net maaşınızı hemen hesaplayın.",
    keywords: [
      "maaş zammı hesaplama",
      "zam sonrası maaş hesaplama",
      "yüzde zam hesaplama",
      "maaş artışı hesaplama",
    ],
    icerik: (
      <p>
        <strong>Maaş zammı hesaplama</strong> aracı, mevcut brüt maaşınıza
        uygulanan zam oranını girerek zam sonrası brüt maaşı ve tahmini net
        maaşınızı gösterir. Böylece yüzdesel zammın net ücretinize gerçek
        yansımasını (SGK ve gelir vergisi kesintileri sonrası) önceden
        görebilirsiniz.
      </p>
    ),
    sss: [
      {
        soru: "Zam sonrası net maaş nasıl hesaplanır?",
        cevap:
          "Önce yeni brüt maaş bulunur (mevcut brüt × (1 + zam oranı)). Ardından bu brüt üzerinden SGK, gelir vergisi ve damga vergisi kesintileri düşülerek tahmini net maaş hesaplanır. Net artış, brüt artıştan daha düşük olabilir çünkü kesintiler de artar.",
      },
    ],
  },
  {
    slug: "yillik-izin-hesaplama",
    tabId: "yillikIzin",
    ad: "Yıllık İzin",
    h1: "Yıllık İzin Hesaplama (2026)",
    kart: "İşe başlama tarihinize göre yıllık ücretli izin hakkınızı ve kalan izninizi hesaplayın.",
    metaBaslik: "Yıllık İzin Hesaplama 2026 | İzin Hakkı Gün Sayısı",
    metaAciklama:
      "Yıllık izin hesaplama aracı: işe başlama tarihinizi girin, kıdeminize göre yıllık ücretli izin hakkınızı (14–26 gün) ve kalan izninizi öğrenin.",
    keywords: [
      "yıllık izin hesaplama",
      "yıllık izin hakkı kaç gün",
      "izin günü hesaplama",
      "yıllık ücretli izin",
    ],
    icerik: (
      <p>
        <strong>Yıllık ücretli izin</strong> hakkı, 1 yılını dolduran çalışanın
        kıdemine göre belirlenir: 1–5 yıl için 14, 5–15 yıl için 20, 15 yıl ve
        üzeri için 26 iş günü. 18 yaşından küçük ve 50 yaşından büyük
        çalışanlara kıdemine bakılmaksızın en az 20 iş günü izin verilir.{" "}
        <strong>Yıllık izin hesaplama</strong> aracıyla işe başlama tarihinizi
        girerek hak ettiğiniz ve kalan izin gününüzü öğrenebilirsiniz.
      </p>
    ),
    sss: [
      {
        soru: "Yıllık ücretli izin hakkı kaç gündür?",
        cevap:
          "1–5 yıl kıdem için 14 iş günü, 5–15 yıl için 20 iş günü, 15 yıl ve üzeri için 26 iş günüdür. 18 yaş altı ve 50 yaş üstü çalışanlara en az 20 iş günü izin verilir.",
      },
      {
        soru: "Yıllık izne ne zaman hak kazanılır?",
        cevap:
          "Çalışan, işe başladığı tarihten itibaren en az 1 yıl çalışmasını tamamladığında yıllık ücretli izne hak kazanır. İlk yıl dolmadan yasal yıllık izin hakkı doğmaz.",
      },
    ],
  },
];

export function aracBul(slug: string): Arac | undefined {
  return ARACLAR.find((a) => a.slug === slug);
}
