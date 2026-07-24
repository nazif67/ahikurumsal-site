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
  const ilaclar = (formData.get("ilaclar") as string)?.trim();

  if (!adSoyad || !ilaclar) {
    return { status: "error", message: "Lütfen tüm alanları doldurun." };
  }

  try {
    await strapiPost("/ilac-talepleri", { adSoyad, ilaclar });
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Talebiniz gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
