import { notFound } from "next/navigation";
import Link from "next/link";
import { strapiGetSingle } from "@/lib/strapi";

export const revalidate = 60;

type Duyuru = {
  title: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
};

export async function generateMetadata({
  params,
}: {
  params: { documentId: string };
}) {
  try {
    const data = await strapiGetSingle<Duyuru>(`/duyurular/${params.documentId}`);
    if (data) return { title: data.title };
  } catch {}
  return { title: "Duyuru bulunamadı" };
}

export default async function DuyuruDetailPage({
  params,
}: {
  params: { documentId: string };
}) {
  let duyuru: (Duyuru & { id: number; documentId: string }) | null = null;

  try {
    duyuru = await strapiGetSingle<Duyuru>(`/duyurular/${params.documentId}`);
  } catch {
    notFound();
  }

  if (!duyuru) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/duyurular"
        className="text-sm text-brand hover:underline inline-block mb-6"
      >
        ← Duyurulara dön
      </Link>

      <div className="flex items-center gap-2 mb-2">
        {duyuru.date && <p className="text-sm text-gray-400">{duyuru.date}</p>}
        {duyuru.pinned && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Sabit
          </span>
        )}
        {duyuru.category && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {duyuru.category}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900">{duyuru.title}</h1>

      {duyuru.content && (
        <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {duyuru.content}
        </div>
      )}
    </article>
  );
}
