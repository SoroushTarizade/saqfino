"use client";

import React from "react";
import { IoArrowUp } from "react-icons/io5";

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="رفتن به ابتدای صفحه"
      className="
        group
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        border
        border-gray-5
        bg-white
        text-gray-11
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-primary
        hover:bg-primary
        hover:text-white
        active:scale-95
      "
    >
      <IoArrowUp
        className="
          h-5
          w-5
          transition-transform
          duration-300
          group-hover:-translate-y-0.5
        "
      />
    </button>
  );
}