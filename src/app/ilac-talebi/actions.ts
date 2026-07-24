"use server";

import { strapiPost } from "@/lib/strapi";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function ilacTalebiGonder(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const adSoyad = (formData.get("adSoyad") as string)?.trim();
  const ilacAdlari = formData.getAll("ilacAdi").map((v) => (v as string).trim());
  const mgDegerleri = formData.getAll("mg").map((v) => (v as string).trim());
  const hekimRaporu = formData.get("hekimRaporu") as string;
  const kvkkOnay = formData.get("kvkkOnay");

  const ilaclar: { ilacAdi: string; mg: string }[] = [];
  for (let i = 0; i < ilacAdlari.length; i++) {
    const ilacAdi = ilacAdlari[i];
    const mg = mgDegerleri[i] ?? "";
    if (!ilacAdi && !mg) continue;
    if (!ilacAdi || !mg) {
      return {
        status: "error",
        message: "Her ilaç için hem ad hem mg bilgisini giriniz.",
      };
    }
    ilaclar.push({ ilacAdi, mg });
  }

  if (!adSoyad || ilaclar.length === 0 || !hekimRaporu) {
    return { status: "error", message: "Lütfen tüm alanları doldurun." };
  }

  // Sağlık verisi (ilaç bilgisi) KVKK'da özel nitelikli kişisel veridir,
  // açık rıza olmadan işlenemez.
  if (!kvkkOnay) {
    return {
      status: "error",
      message: "Devam etmek için Aydınlatma Metni'ni onaylamanız gerekmektedir.",
    };
  }

  try {
    await strapiPost("/ilac-talepleri", { adSoyad, ilaclar, hekimRaporu });
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Talebiniz gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
