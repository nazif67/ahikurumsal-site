"use client";

import { useFormState, useFormStatus } from "react-dom";
import { iletisimGonder, FormState } from "./actions";

const initialState: FormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Gönderiliyor..." : "Mesaj Gönder"}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useFormState(iletisimGonder, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h2 className="text-lg font-semibold text-green-800">
          Mesajınız iletildi!
        </h2>
        <p className="mt-2 text-sm text-green-700">
          En kısa sürede geri dönüş yapılacaktır.
        </p>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            id="ad"
            name="ad"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ornek@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="konu" className="block text-sm font-medium text-gray-700 mb-1">
          Konu <span className="text-red-500">*</span>
        </label>
        <input
          id="konu"
          name="konu"
          type="text"
          required
          placeholder="Mesajınızın konusu"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div>
        <label htmlFor="mesaj" className="block text-sm font-medium text-gray-700 mb-1">
          Mesaj <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mesaj"
          name="mesaj"
          required
          rows={6}
          placeholder="Mesajınızı buraya yazın..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
