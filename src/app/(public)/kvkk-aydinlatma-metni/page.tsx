import { VERI_SORUMLUSU as V, SON_GUNCELLEME } from "@/lib/legal";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Ahikurumsal aydınlatma metni.",
  alternates: { canonical: "https://ahikurumsal.com/kvkk-aydinlatma-metni" },
  robots: { index: true, follow: true },
};

export default function KvkkAydinlatmaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-legal">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Kişisel Verilerin Korunması Aydınlatma Metni
      </h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: {SON_GUNCELLEME}</p>

      <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Veri Sorumlusu</h2>
          <p>
            İşbu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (“KVKK”) m.10 kapsamında, veri sorumlusu sıfatıyla {V.unvan} tarafından
            hazırlanmıştır.
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Unvan:</strong> {V.unvan}</li>
            <li><strong>Adres:</strong> {V.adres}</li>
            <li><strong>E-posta:</strong> {V.eposta}</li>
            <li><strong>KEP:</strong> {V.kep}</li>
            <li><strong>Telefon:</strong> {V.telefon}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. İşlenen Kişisel Veriler</h2>
          <p>
            Web sitemizi ziyaretiniz ve hizmetlerimizden yararlanmanız kapsamında
            aşağıdaki kişisel veriler işlenebilir:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Kimlik ve iletişim bilgileri:</strong> ad, soyad, e-posta, telefon.</li>
            <li><strong>İşlem ve talep bilgileri:</strong> iletişim/danışmanlık formu içeriği, mesajlarınız.</li>
            <li><strong>İşlem güvenliği bilgileri:</strong> IP adresi, tarayıcı bilgisi, çerez verileri, ziyaret istatistikleri.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. İşleme Amaçları</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>İletişim ve danışmanlık taleplerinizin karşılanması,</li>
            <li>Hizmetlerin sunulması, iyileştirilmesi ve kişiselleştirilmesi,</li>
            <li>Web sitesi güvenliğinin ve işlevselliğinin sağlanması,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi,</li>
            <li>Onay vermeniz halinde ziyaret istatistiklerinin analiz edilmesi.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Hukuki Sebepler</h2>
          <p>
            Kişisel verileriniz KVKK m.5 uyarınca; bir sözleşmenin kurulması veya
            ifası için gerekli olması, veri sorumlusunun hukuki yükümlülüğünü yerine
            getirmesi, ilgili kişinin temel hak ve özgürlüklerine zarar vermemek
            kaydıyla meşru menfaat ve gerektiğinde açık rızanız hukuki sebeplerine
            dayanılarak işlenir. Analitik/pazarlama çerezleri yalnızca açık rızanıza
            dayanılarak işlenir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Aktarım</h2>
          <p>
            Kişisel verileriniz; hizmet aldığımız barındırma (hosting), altyapı ve
            analiz sağlayıcıları ile yalnızca yukarıdaki amaçlarla sınırlı olarak ve
            KVKK m.8 ve m.9’a uygun şekilde paylaşılabilir. Yurt dışına aktarım
            gerektiren hizmetlerde (ör. analiz araçları) mevzuata uygun güvenceler
            uygulanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Toplama Yöntemi</h2>
          <p>
            Kişisel verileriniz; web sitesi üzerindeki formlar, e-posta, çerezler ve
            benzeri elektronik ortamlar aracılığıyla otomatik ve kısmen otomatik
            yollarla toplanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. İlgili Kişinin Hakları (KVKK m.11)</h2>
          <p>Kişisel verilerinize ilişkin olarak aşağıdaki haklara sahipsiniz:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>Şartları oluştuğunda silinmesini/yok edilmesini isteme,</li>
            <li>Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Başvuru Yöntemi</h2>
          <p>
            Haklarınıza ilişkin taleplerinizi {V.eposta} e-posta adresine veya {V.adres}{" "}
            adresine yazılı olarak iletebilirsiniz. Başvurularınız en geç 30 gün
            içinde sonuçlandırılır.
          </p>
        </section>
      </div>
    </article>
  );
}
