"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

export default function Login() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(
      formData.get("email") || "",
    ).trim();

    const password = String(
      formData.get("password") || "",
    );

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message ||
            "ورود به حساب کاربری انجام نشد.",
        );

        return;
      }

      // Login was successful.
      // The session is stored securely in an HttpOnly cookie.
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Login request error:",
        error,
      );

      setErrorMessage(
        "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-gray-10"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        {/* Visual Panel */}
        <section className="relative hidden min-h-screen overflow-hidden bg-gray-3 lg:flex lg:w-1/2">
          <div className="absolute inset-0">
            <Image
              src="/images/login.jpeg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link
              href="/"
              aria-label="سقفینو"
              className="w-fit transition-transform duration-200 hover:scale-105"
            >
              <Image
                src="/images/logo.png"
                alt="سقفینو"
                width={131}
                height={63}
                priority
              />
            </Link>

            {/* Bottom Content */}
            <div className="max-w-[500px] text-white">
              <span className="mb-5 inline-flex rounded-sm bg-primary px-4 py-2 text-sm font-bold">
                سقفینو
              </span>

              <h1 className="text-3xl font-bold leading-[1.5] xl:text-4xl">
                خانه‌ای که
                <br />
                دنبالش هستید، همین‌جاست.
              </h1>

              <p className="mt-5 max-w-[440px] text-base leading-8 text-white/80">
                وارد حساب کاربری خود شوید و آگهی‌های مورد علاقه،
                جستجوها و آگهی‌های خود را مدیریت کنید.
              </p>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="flex min-h-screen w-full flex-col lg:w-1/2">
          {/* Mobile Top Bar */}
          <div className="relative flex items-center justify-between border-b border-gray-4 px-4 py-4 md:px-6 lg:hidden">
            <Link
              href="/"
              aria-label="بازگشت به صفحه اصلی"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-sm
                text-gray-8
                transition-colors
                hover:bg-gray-3
                hover:text-primary
              "
            >
              <FiArrowRight size={20} />
            </Link>

            <Link
              href="/"
              aria-label="سقفینو"
              className="absolute left-1/2 -translate-x-1/2"
            >
              <Image
                src="/images/logo.png"
                alt="سقفینو"
                width={131}
                height={63}
                priority
                className="h-auto w-[92px]"
              />
            </Link>

            <div className="w-10" />
          </div>

          {/* Form Wrapper */}
          <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-8 lg:px-12 xl:px-20">
            <div className="w-full max-w-[470px]">
              {/* Heading */}
              <div className="mb-8">
                <p className="mb-3 text-sm font-bold text-primary">
                  خوش آمدید
                </p>

                <h2 className="text-2xl font-bold leading-[1.6] md:text-3xl">
                  ورود به حساب کاربری
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-7 md:text-base">
                  برای ادامه، ایمیل و رمز عبور خود را وارد کنید.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-sm
                    border border-error/20
                    bg-error-tint-2
                    px-4 py-3
                    text-sm
                    leading-7
                    text-error
                  "
                >
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-gray-10"
                  >
                    ایمیل
                  </label>

                  <div className="relative">
                    <FiMail
                      size={19}
                      className="
                        pointer-events-none
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-gray-6
                      "
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="example@email.com"
                      dir="ltr"
                      required
                      className="
                        h-14 w-full
                        rounded-sm
                        border border-gray-5
                        bg-white
                        pr-12 pl-4
                        text-left text-sm
                        text-gray-10
                        outline-none
                        transition-all duration-200
                        placeholder:text-gray-6
                        hover:border-gray-7
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/10
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-gray-10"
                    >
                      رمز عبور
                    </label>

                    <button
                      type="button"
                      className="
                        text-xs font-bold
                        text-primary
                        transition-colors
                        hover:text-primary-shade
                      "
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </div>

                  <div className="relative">
                    <FiLock
                      size={19}
                      className="
                        pointer-events-none
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-gray-6
                      "
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="رمز عبور خود را وارد کنید"
                      required
                      className="
                        h-14 w-full
                        rounded-sm
                        border border-gray-5
                        bg-white
                        pr-12 pl-12
                        text-sm
                        text-gray-10
                        outline-none
                        transition-all duration-200
                        placeholder:text-gray-6
                        hover:border-gray-7
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/10
                      "
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "مخفی کردن رمز عبور"
                          : "نمایش رمز عبور"
                      }
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev,
                        )
                      }
                      className="
                        absolute left-4 top-1/2
                        flex h-8 w-8
                        -translate-y-1/2
                        items-center justify-center
                        rounded-sm
                        text-gray-6
                        transition-colors
                        hover:bg-gray-3
                        hover:text-gray-10
                      "
                    >
                      {showPassword ? (
                        <FiEyeOff size={19} />
                      ) : (
                        <FiEye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-7">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />

                  <span>مرا به خاطر بسپار</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex h-14 w-full
                    items-center justify-center
                    rounded-sm
                    bg-primary
                    text-base font-bold
                    text-white
                    transition-all duration-200
                    hover:brightness-95
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isLoading
                    ? "در حال ورود..."
                    : "ورود به حساب"}
                </button>
              </form>

              {/* Register */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-4" />

                <span className="text-xs text-gray-6">
                  حساب کاربری ندارید؟
                </span>

                <div className="h-px flex-1 bg-gray-4" />
              </div>

              <Link
                href="/register"
                className="
                  flex h-14 w-full
                  items-center justify-center
                  rounded-sm
                  border border-primary
                  text-base font-bold
                  text-primary
                  transition-all duration-200
                  hover:bg-primary
                  hover:text-white
                "
              >
                ایجاد حساب کاربری
              </Link>

              {/* Back Home */}
              <Link
                href="/"
                className="
                  mx-auto mt-7
                  flex w-fit
                  items-center gap-2
                  text-sm font-bold
                  text-gray-7
                  transition-colors
                  hover:text-primary
                "
              >
                <FiArrowRight size={17} />
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
