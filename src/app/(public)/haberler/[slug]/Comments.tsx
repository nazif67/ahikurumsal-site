"use client";

import { useFormState, useFormStatus } from "react-dom";
import { yorumGonder, YorumFormState } from "../actions";

type Yorum = {
  id: number;
  documentId: string;
  author: string;
  content: string;
  createdAt: string;
};

const initialState: YorumFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Gönderiliyor..." : "Yorum Gönder"}
    </button>
  );
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "bugün";
  if (days === 1) return "1 gün önce";
  return `${days} gün önce`;
}

export default function Comments({
  haberId,
  yorumlar,
}: {
  haberId: number;
  yorumlar: Yorum[];
}) {
  const boundAction = yorumGonder.bind(null, haberId);
  const [state, action] = useFormState(boundAction, initialState);

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Yorumlar {yorumlar.length > 0 && `(${yorumlar.length})`}
      </h2>

      <div className="mt-6">
        {state.status === "success" ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {state.message}
          </div>
        ) : (
          <form action={action} className="space-y-3">
            {state.status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.message}
              </div>
            )}
            <input
              type="text"
              name="author"
              required
              maxLength={80}
              placeholder="Adınız"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:max-w-xs"
            />
            <textarea
              name="content"
              required
              rows={4}
              maxLength={2000}
              placeholder="Yorumunuzu yazın..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
            />
            <SubmitButton />
          </form>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {yorumlar.length === 0 && (
          <p className="text-sm text-gray-400">Henüz yorum yapılmamış. İlk yorumu siz yapın.</p>
        )}
        {yorumlar.map((y) => (
          <div key={y.documentId} className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200 mt-1 flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0">
              {y.author?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{y.author}</p>
                <p className="text-xs text-gray-400">{timeAgo(y.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{y.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
