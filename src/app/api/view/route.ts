import { strapiIncrementView } from "@/lib/strapi";

const VALID_TYPES = ["haberler", "duyurular", "blogs"] as const;
type ValidType = (typeof VALID_TYPES)[number];

export async function POST(req: Request) {
  let body: { type?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { type, slug } = body;

  if (
    !type ||
    !slug ||
    !VALID_TYPES.includes(type as ValidType) ||
    typeof slug !== "string"
  ) {
    return Response.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const views = await strapiIncrementView(type as ValidType, slug);
  if (views === null) {
    return Response.json({ error: "Bulunamadı" }, { status: 404 });
  }

  return Response.json({ views });
}
