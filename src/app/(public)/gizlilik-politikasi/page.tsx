import { VERI_SORUMLUSU as V, SON_GUNCELLEME } from "@/lib/legal";

export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "Ahikurumsal kişisel verilerinizi nasıl topladığı, kullandığı ve koruduğuna dair gizlilik politikası.",
  alternates: { canonical: "https://ahikurumsal.com/gizlilik-politikasi" },
  robots: { index: true, follow: true },
};

export default function GizlilikPolitikasiPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: {SON_GUNCELLEME}</p>

      <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
        <section>
          <p>
            {V.unvan} (“Ahikurumsal”, “biz”) olarak gizliliğinize önem veriyoruz. Bu
            Gizlilik Politikası; web sitemizi kullandığınızda kişisel verilerinizi nasıl
            topladığımızı, kullandığımızı, koruduğumuzu ve haklarınızı açıklar.
            Kişisel verilerin işlenmesine ilişkin ayrıntılı bilgilendirme için{" "}
            <a href="/kvkk-aydinlatma-metni" className="text-brand underline hover:opacity-80">
              KVKK Aydınlatma Metni
            </a>
            ’ni de inceleyiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Topladığımız Veriler</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>İletişim formu aracılığıyla ilettiğiniz ad, e-posta ve mesaj içeriği,</li>
            <li>Site kullanımı sırasında oluşan teknik veriler (IP, tarayıcı, çerezler),</li>
            <li>Onay vermeniz halinde analitik ziyaret istatistikleri.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Verileri Kullanma Amacımız</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Taleplerinize yanıt vermek ve hizmet sunmak,</li>
            <li>Site güvenliğini ve işleyişini sağlamak,</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek,</li>
            <li>Onayınızla site deneyimini analiz edip iyileştirmek.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Verilerin Saklanması ve Güvenliği</h2>
          <p>
            Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta
            öngörülen saklama süreleri boyunca muhafaza edilir; süre sonunda silinir,
            yok edilir veya anonim hale getirilir. Verilerinizin yetkisiz erişime karşı
            korunması için uygun teknik ve idari tedbirler alınır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Üçüncü Taraflar</h2>
          <p>
            Verileriniz yalnızca hizmetin sunulması için gerekli olan barındırma,
            altyapı ve analiz sağlayıcılarıyla, amaçla sınırlı olarak paylaşılır.
            Verileriniz pazarlama amacıyla üçüncü kişilere satılmaz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Haklarınız ve İletişim</h2>
          <p>
            KVKK m.11 kapsamındaki haklarınızı kullanmak veya gizlilikle ilgili
            sorularınız için {V.eposta} adresi üzerinden bizimle iletişime
            geçebilirsiniz.
          </p>
        </section>
      </div>
    </article>
  );
}
