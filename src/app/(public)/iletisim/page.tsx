import { strapiGetSingle } from "@/lib/strapi";
import ContactForm from "./ContactForm";

export const metadata = { title: "İletişim" };

type Hakkimda = {
  email: string;
  telefon: string;
  linkedin: string;
};

export default async function IletisimPage() {
  let profile: (Hakkimda & { id: number; documentId: string }) | null = null;

  try {
    profile = await strapiGetSingle<Hakkimda>("/hakkimda");
  } catch {
    profile = null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">İletişim</h1>
      <p className="text-gray-500 mb-10">
        Sorularınız veya işbirliği teklifleriniz için aşağıdaki formu doldurabilirsiniz.
      </p>

      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <ContactForm />
        </div>

        <aside className="md:col-span-2 space-y-5">
          {profile?.email && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                E-posta
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-gray-700 hover:text-brand transition-colors"
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile?.telefon && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Telefon
              </p>
              <a
                href={`tel:${profile.telefon}`}
                className="text-sm text-gray-700 hover:text-brand transition-colors"
              >
                {profile.telefon}
              </a>
            </div>
          )}
          {profile?.linkedin && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                LinkedIn
              </p>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 hover:text-brand transition-colors"
              >
                Profili görüntüle →
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
