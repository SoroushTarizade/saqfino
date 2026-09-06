"use client";

import { FiShare2 } from "react-icons/fi";

type ShareButtonProps = {
  title: string;
  text: string;
};

export default function ShareButton({
  title,
  text,
}: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch {
        // User cancelled the share dialog.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("لینک مقاله کپی شد.");
    } catch {
      alert("امکان اشتراک‌گذاری یا کپی لینک وجود ندارد.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
    >
      <FiShare2 />
      اشتراک‌گذاری
    </button>
  );
}