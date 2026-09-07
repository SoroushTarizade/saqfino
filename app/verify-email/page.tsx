"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type VerificationState =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailPage() {
  const [state, setState] =
    useState<VerificationState>("loading");

  const [message, setMessage] = useState(
    "در حال بررسی لینک تأیید ایمیل...",
  );

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params =
          new URLSearchParams(window.location.search);

        const token = params.get("token");

        if (!token) {
          setState("error");
          setMessage(
            "لینک تأیید ایمیل معتبر نیست.",
          );
          return;
        }

        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(
            token,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setState("error");
          setMessage(
            data.message ||
              "تأیید ایمیل با مشکل مواجه شد.",
          );
          return;
        }

        setState("success");
        setMessage(
          data.message ||
            "ایمیل شما با موفقیت تأیید شد.",
        );
      } catch (error) {
        console.error(
          "Verify email page error:",
          error,
        );

        setState("error");
        setMessage(
          "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
        );
      }
    };

    verifyEmail();
  }, []);

  return (
    <main
      dir="rtl"
      className="
        flex min-h-screen
        items-center justify-center
        bg-white
        px-4 py-10
      "
    >
      <div
        className="
          flex w-full max-w-[500px]
          flex-col items-center
          rounded-lg
          border border-gray-4
          bg-white
          px-6 py-10
          text-center
          shadow-sm
          sm:px-10
        "
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="سقفینو"
          className="mb-8 transition-transform duration-200 hover:scale-105"
        >
          <Image
            src="/images/logo.png"
            alt="سقفینو"
            width={131}
            height={63}
            priority
          />
        </Link>

        {/* Loading */}
        {state === "loading" && (
          <>
            <div
              className="
                mb-6
                h-14 w-14
                animate-spin
                rounded-full
                border-4
                border-gray-4
                border-t-primary
              "
              aria-hidden="true"
            />

            <h1
              className="
                mb-3
                text-xl font-bold
                text-gray-10
                sm:text-2xl
              "
            >
              در حال تأیید ایمیل
            </h1>

            <p
              className="
                text-sm
                leading-7
                text-gray-7
                sm:text-base
              "
            >
              لطفاً چند لحظه صبر کنید...
            </p>
          </>
        )}

        {/* Success */}
        {state === "success" && (
          <>
            <div
              className="
                mb-6
                flex h-16 w-16
                items-center justify-center
                rounded-full
                bg-success-tint-2
                text-3xl
                text-success
              "
              aria-hidden="true"
            >
              ✓
            </div>

            <h1
              className="
                mb-3
                text-xl font-bold
                text-gray-10
                sm:text-2xl
              "
            >
              ایمیل شما تأیید شد
            </h1>

            <p
              className="
                mb-8
                text-sm
                leading-8
                text-gray-7
                sm:text-base
              "
            >
              {message}
              <br />
              حالا می‌توانید وارد حساب کاربری خود شوید.
            </p>

            <Link
              href="/login"
              className="
                flex h-12 w-full
                items-center justify-center
                rounded-sm
                bg-primary
                font-bold
                text-white
                transition-all duration-200
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              ورود به حساب کاربری
            </Link>

            <Link
              href="/"
              className="
                mt-4
                text-sm font-bold
                text-gray-7
                transition-colors
                hover:text-primary
              "
            >
              بازگشت به صفحه اصلی
            </Link>
          </>
        )}

        {/* Error */}
        {state === "error" && (
          <>
            <div
              className="
                mb-6
                flex h-16 w-16
                items-center justify-center
                rounded-full
                bg-error-tint-2
                text-3xl
                text-error
              "
              aria-hidden="true"
            >
              !
            </div>

            <h1
              className="
                mb-3
                text-xl font-bold
                text-gray-10
                sm:text-2xl
              "
            >
              تأیید ایمیل ناموفق بود
            </h1>

            <p
              className="
                mb-8
                text-sm
                leading-8
                text-gray-7
                sm:text-base
              "
            >
              {message}
            </p>

            <Link
              href="/login"
              className="
                flex h-12 w-full
                items-center justify-center
                rounded-sm
                border border-primary
                font-bold
                text-primary
                transition-all duration-200
                hover:bg-primary
                hover:text-white
                active:scale-[0.98]
              "
            >
              رفتن به صفحه ورود
            </Link>

            <Link
              href="/"
              className="
                mt-4
                text-sm font-bold
                text-gray-7
                transition-colors
                hover:text-primary
              "
            >
              بازگشت به صفحه اصلی
            </Link>
          </>
        )}
      </div>
    </main>
  );
}