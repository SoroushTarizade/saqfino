import Link from "next/link";
import {
  FiHome,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-16"
    >
      <div className="relative mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl"
        />

        {/* Location icon */}
        <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <FiMapPin size={38} strokeWidth={1.7} />

          <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
            !
          </span>
        </div>

        {/* 404 */}
        <h1
          className="
            relative
            text-[clamp(100px,20vw,190px)]
            font-bold
            leading-[0.8]
            tracking-[-0.08em]
            text-[var(--color-primary)]
          "
        >
          404
        </h1>

        {/* Content */}
        <div className="relative mt-10 max-w-[600px]">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            این صفحه روی نقشه پیدا نشد!
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
            به نظر می‌رسد صفحه‌ای که دنبال آن هستید وجود ندارد، حذف شده یا
            آدرس آن تغییر کرده است.
          </p>
        </div>

        {/* Actions */}
        <div className="relative mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-6
              py-3.5
              text-sm
              font-bold
              text-white
              transition-all
              hover:-translate-y-0.5
              hover:opacity-90
              sm:w-auto
            "
          >
            <FiHome size={18} />
            صفحه اصلی
          </Link>

          <Link
            href="/rent"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-6
              py-3.5
              text-sm
              font-bold
              text-gray-800
              transition-all
              hover:-translate-y-0.5
              hover:border-[var(--color-primary)]
              hover:text-[var(--color-primary)]
              sm:w-auto
            "
          >
            <FiSearch size={18} />
            جستجوی ملک
          </Link>
        </div>

        {/* Branding */}
        <div className="relative mt-12 text-xs text-gray-400">
          سقفینو؛ خانه‌ای که دنبالش هستید
        </div>
      </div>
    </main>
  );
}