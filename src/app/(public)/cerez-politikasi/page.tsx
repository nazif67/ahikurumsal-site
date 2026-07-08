import { VERI_SORUMLUSU as V, SON_GUNCELLEME } from "@/lib/legal";
import CerezTercihleriButonu from "@/components/CerezTercihleriButonu";

export const metadata = {
  title: "Çerez Politikası",
  description:
    "Ahikurumsal web sitesinde kullanılan çerezler, türleri ve tercih yönetimi hakkında bilgilendirme.",
  alternates: { canonical: "https://ahikurumsal.com/cerez-politikasi" },
  robots: { index: true, follow: true },
};

export default function CerezPolitikasiPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Çerez Politikası</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: {SON_GUNCELLEME}</p>

      <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Çerez Nedir?</h2>
          <p>
            Çerezler (cookies), web sitelerini ziyaret ettiğinizde tarayıcınıza
            kaydedilen küçük metin dosyalarıdır. Sitenin düzgün çalışması, tercihlerinizin
            hatırlanması ve ziyaret istatistiklerinin ölçülmesi için kullanılırlar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Kullandığımız Çerez Türleri</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Tür</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Amaç</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Onay</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">Zorunlu Çerezler</td>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">
                    Sitenin temel işlevlerinin (güvenlik, oturum, tercih hatırlama)
                    çalışması için gereklidir. Devre dışı bırakılamaz.
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">Gerekli değil</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">Analitik Çerezler</td>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">
                    Google Analytics aracılığıyla ziyaretçi sayısı, sayfa görüntüleme ve
                    kullanım eğilimlerini anonim olarak ölçer. IP adresi anonimleştirilir.
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2 align-top">Açık rıza gerekir</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Analitik çerezler yalnızca çerez bildiriminde <strong>“Kabul Et”</strong>
            seçeneğini işaretlemeniz halinde çalışır. “Reddet” demeniz halinde hiçbir
            analitik/izleme çerezi yüklenmez.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Çerez Tercihlerinizi Yönetme</h2>
          <p>
            Verdiğiniz onayı istediğiniz zaman aşağıdaki düğmeyle sıfırlayabilir; ayrıca
            tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
          </p>
          <div className="mt-4">
            <CerezTercihleriButonu />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">İletişim</h2>
          <p>
            Çerez uygulamalarımıza ilişkin sorularınız için {V.eposta} adresi üzerinden
            veri sorumlusu {V.unvan} ile iletişime geçebilirsiniz. Ayrıntılı bilgi için{" "}
            <a href="/kvkk-aydinlatma-metni" className="text-brand underline hover:opacity-80">
              KVKK Aydınlatma Metni
            </a>
            ’ni inceleyebilirsiniz.
          </p>
        </section>
      </div>
    </article>
  );
}
