"use client";

import { useEffect } from "react";
import { incrementBlogView } from "@/app/(public)/blog/actions";

export default function ViewTracker({ documentId }: { documentId: string }) {
  useEffect(() => {
    const key = `viewed-${documentId}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      incrementBlogView(documentId);
    }
  }, [documentId]);

  return null;
}
