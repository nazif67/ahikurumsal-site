"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ilacTalebiGonder, FormState } from "./actions";

const initialState: FormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Gönderiliyor..." : "Talebi Gönder"}
    </button>
  );
}

export default function IlacForm() {
  const [state, action] = useFormState(ilacTalebiGonder, initialState);
  const [satirlar, setSatirlar] = useState<number[]>([0]);
  const sonrakiId = useRef(1);

  const satirEkle = () => {
    setSatirlar((mevcut) => [...mevcut, sonrakiId.current++]);
  };

  const satirSil = (id: number) => {
    setSatirlar((mevcut) => mevcut.filter((s) => s !== id));
  };

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h2 className="text-lg font-semibold text-green-800">
          Talebiniz iletildi!
        </h2>
        <p className="mt-2 text-sm text-green-700">
          Doktorumuza bildirim gönderildi.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ana Menüye Dön
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="adSoyad" className="block text-sm font-medium text-gray-700 mb-1">
          Ad Soyad <span className="text-red-500">*</span>
        </label>
        <input
          id="adSoyad"
          name="adSoyad"
          type="text"
          required
          placeholder="Adınız Soyadınız"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          İlaçlar <span className="text-red-500">*</span>
        </span>
        <div className="space-y-2">
          {satirlar.map((id, index) => (
            <div key={id} className="flex gap-2">
              <input
                name="ilacAdi"
                type="text"
                required
                placeholder="İlaç adı"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <input
                name="mg"
                type="text"
                required
                placeholder="Mg (örn: 500 mg)"
                className="w-32 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {satirlar.length > 1 && (
                <button
                  type="button"
                  onClick={() => satirSil(id)}
                  aria-label={`${index + 1}. ilacı sil`}
                  className="flex-shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-gray-500 hover:bg-gray-50"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={satirEkle}
          className="mt-2 text-sm font-medium text-brand hover:opacity-80"
        >
          + İlaç Ekle
        </button>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Uzman Hekim Raporu <span className="text-red-500">*</span>
        </span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="hekimRaporu"
              value="var"
              required
              className="h-4 w-4 border-gray-300 text-brand focus:ring-brand/30"
            />
            Var
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="hekimRaporu"
              value="yok"
              required
              className="h-4 w-4 border-gray-300 text-brand focus:ring-brand/30"
            />
            Yok
          </label>
        </div>
      </div>

      <label htmlFor="kvkkOnay" className="flex items-start gap-2.5 text-sm text-gray-600">
        <input
          id="kvkkOnay"
          name="kvkkOnay"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-brand focus:ring-brand/30"
        />
        <span>
          Sağlık verimin (ilaç bilgim),{" "}
          <a href="/kvkk-aydinlatma-metni" target="_blank" rel="noopener noreferrer" className="text-brand underline hover:opacity-80">
            KVKK Aydınlatma Metni
          </a>{" "}
          kapsamında yalnızca doktora iletilmesi amacıyla işlenmesini kabul
          ediyorum. <span className="text-red-500">*</span>
        </span>
      </label>

      <SubmitButton />

      <Link
        href="/"
        className="block text-center text-sm text-gray-500 hover:text-gray-700"
      >
        Ana Menüye Dön
      </Link>
    </form>
  );
}
