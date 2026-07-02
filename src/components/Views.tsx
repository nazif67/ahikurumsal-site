"use client";

import { useEffect, useState } from "react";

function EyeIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function ViewBadge({ views }: { views: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <EyeIcon />
      {views ?? 0}
    </span>
  );
}

type ContentType = "haberler" | "duyurular" | "blogs";

export function ViewCounter({
  type,
  slug,
  initialViews,
}: {
  type: ContentType;
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `viewed:${type}:${slug}`;
    const last = localStorage.getItem(key);
    const now = Date.now();
    if (last && now - Number(last) < 24 * 60 * 60 * 1000) return;

    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === "number") setViews(data.views);
        localStorage.setItem(key, String(now));
      })
      .catch(() => {});
  }, [type, slug]);

  return <ViewBadge views={views} />;
}
