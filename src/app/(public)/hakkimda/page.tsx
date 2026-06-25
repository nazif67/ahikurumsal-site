import { strapiGetSingle, getStrapiMedia } from "@/lib/strapi";
import { renderMarkdown } from "@/lib/markdown";
import Image from "next/image";

export const revalidate = 60;
export const metadata = { title: "Hakkımda" };

type HakkimdaFoto = { url: string; alternativeText: string | null };

type Hakkimda = {
  ad: string;
  unvan: string;
  bio: string;
  foto: { data: { attributes: HakkimdaFoto } | null } | null;
  email: string;
  telefon: string;
  linkedin: string;
  deneyimYili: number;
  yetenekler: string;
};

export default async function HakkimdaPage() {
  let profile: (Hakkimda & { id: number; documentId: string }) | null = null;
  let bioHtml = "";

  try {
    profile = await strapiGetSingle<Hakkimda>("/hakkimda", {
      populate: "foto",
    });
    if (profile?.bio) {
      bioHtml = await renderMarkdown(profile.bio);
    }
  } catch {
    profile = null;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Hakkımda</h1>
        <p className="mt-4 text-gray-500">
          Profil bilgileri henüz eklenmemiş. Strapi admin panelinden{" "}
          <strong>Hakkımda</strong> bölümünü doldurun.
        </p>
      </div>
    );
  }

  const yetenekler = profile.yetenekler
    ? profile.yetenekler
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Profil başlığı */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        {profile.foto && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200">
            <Image
              src={getStrapiMedia(profile.foto as unknown as string) ?? ""}
              alt={profile.ad ?? "Profil fotoğrafı"}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          {profile.ad && (
            <h1 className="text-3xl font-bold text-gray-900">{profile.ad}</h1>
          )}
          {profile.unvan && (
            <p className="text-brand font-semibold mt-1">{profile.unvan}</p>
          )}
          {profile.deneyimYili && (
            <p className="text-gray-500 text-sm mt-1">
              {profile.deneyimYili} yıl deneyim
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-3">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-gray-600 hover:text-brand transition-colors"
              >
                ✉️ {profile.email}
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-brand transition-colors"
              >
                🔗 LinkedIn
              </a>
            )}
            {profile.telefon && (
              <span className="text-sm text-gray-600">
                📞 {profile.telefon}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Biyografi */}
      {bioHtml && (
        <section className="mb-10">
          <div
            className="prose-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />
        </section>
      )}

      {/* Yetenekler */}
      {yetenekler.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Yetenekler</h2>
          <div className="flex flex-wrap gap-2">
            {yetenekler.map((yetenek) => (
              <span
                key={yetenek}
                className="bg-blue-50 text-brand px-3 py-1 rounded-full text-sm font-medium"
              >
                {yetenek}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
