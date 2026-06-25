"use server";

import { strapiPost } from "@/lib/strapi";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function iletisimGonder(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const ad = (formData.get("ad") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const konu = (formData.get("konu") as string)?.trim();
  const mesaj = (formData.get("mesaj") as string)?.trim();

  if (!ad || !email || !konu || !mesaj) {
    return { status: "error", message: "Lütfen tüm alanları doldurun." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Geçerli bir e-posta adresi girin." };
  }

  try {
    await strapiPost("/iletisim-mesajlaris", { ad, email, konu, mesaj });
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
