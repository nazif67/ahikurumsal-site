"use server";

import { strapiPost } from "@/lib/strapi";

export type YorumFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function yorumGonder(
  haberId: number,
  _prev: YorumFormState,
  formData: FormData
): Promise<YorumFormState> {
  const author = (formData.get("author") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!author) {
    return { status: "error", message: "Lütfen adınızı girin." };
  }
  if (author.length > 80) {
    return { status: "error", message: "İsim en fazla 80 karakter olabilir." };
  }
  if (!content) {
    return { status: "error", message: "Yorum boş olamaz." };
  }
  if (content.length > 2000) {
    return { status: "error", message: "Yorum en fazla 2000 karakter olabilir." };
  }

  try {
    await strapiPost("/yorumlar", {
      author,
      content,
      approved: false,
      haber: haberId,
    });
    return {
      status: "success",
      message: "Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacaktır.",
    };
  } catch {
    return { status: "error", message: "Yorum gönderilemedi. Lütfen tekrar deneyin." };
  }
}
