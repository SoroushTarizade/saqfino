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
  FiUser,
} from "react-icons/fi";

type Gender = "male" | "female" | "";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [gender, setGender] = useState<Gender>("");

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // Store the form before the async operation.
    // event.currentTarget can become null after await.
    const form = event.currentTarget;

    setErrorMessage("");
    setSuccessMessage("");

    if (!gender) {
      setErrorMessage("لطفاً جنسیت خود را انتخاب کنید.");
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage(
        "برای ایجاد حساب باید با قوانین و شرایط استفاده موافق باشید.",
      );
      return;
    }

    const formData = new FormData(form);

    const firstName = String(
      formData.get("firstName") ?? "",
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? "",
    ).trim();

    const email = String(
      formData.get("email") ?? "",
    ).trim();

    const password = String(
      formData.get("password") ?? "",
    );

    const confirmPassword = String(
      formData.get("confirmPassword") ?? "",
    );

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage(
        "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "رمز عبور و تکرار آن یکسان نیستند.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            gender,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "ثبت‌نام انجام نشد. دوباره تلاش کنید.",
        );
        return;
      }

      setSuccessMessage(
        data.message ||
          "حساب کاربری با موفقیت ایجاد شد.",
      );

      // Reset the form using the stored form reference.
      form.reset();

      setGender("");
      setAgreeToTerms(false);
    } catch (error) {
      console.error(
        "Register request error:",
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
        {/* =========================
            Visual Panel
        ========================== */}
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

            {/* Visual Content */}
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
                در سقفینو حساب کاربری خود را بسازید و
                آگهی‌ها، جستجوها و فعالیت‌های خود را
                راحت‌تر مدیریت کنید.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            Register Section
        ========================== */}
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
                  به سقفینو بپیوندید
                </p>

                <h2 className="text-2xl font-bold leading-[1.6] md:text-3xl">
                  ایجاد حساب کاربری
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-7 md:text-base">
                  اطلاعات خود را وارد کنید تا حساب کاربری
                  شما در سقفینو ساخته شود.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-sm
                    border border-red-200
                    bg-red-50
                    px-4 py-3
                    text-sm
                    leading-6
                    text-red-700
                  "
                >
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div
                  role="status"
                  className="
                    mb-5
                    rounded-sm
                    border border-green-200
                    bg-green-50
                    px-4 py-3
                    text-sm
                    leading-6
                    text-green-700
                  "
                >
                  {successMessage}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-bold text-gray-10"
                    >
                      نام
                    </label>

                    <div className="relative">
                      <FiUser
                        size={19}
                        className="
                          pointer-events-none
                          absolute right-4 top-1/2
                          -translate-y-1/2
                          text-gray-6
                        "
                      />

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="نام"
                        className="
                          h-14 w-full
                          rounded-sm
                          border border-gray-5
                          bg-white
                          pr-12 pl-4
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
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-bold text-gray-10"
                    >
                      نام خانوادگی
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="نام خانوادگی"
                      className="
                        h-14 w-full
                        rounded-sm
                        border border-gray-5
                        bg-white
                        px-4
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
                  </div>
                </div>

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

                {/* Gender */}
                <div>
                  <span className="mb-2 block text-sm font-bold text-gray-10">
                    جنسیت
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`
                        flex h-14 items-center justify-center
                        rounded-sm
                        border
                        text-sm font-bold
                        transition-all duration-200
                        ${
                          gender === "male"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-5 text-gray-7 hover:border-gray-7"
                        }
                      `}
                    >
                      مرد
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`
                        flex h-14 items-center justify-center
                        rounded-sm
                        border
                        text-sm font-bold
                        transition-all duration-200
                        ${
                          gender === "female"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-5 text-gray-7 hover:border-gray-7"
                        }
                      `}
                    >
                      زن
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-gray-10"
                  >
                    رمز عبور
                  </label>

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
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="حداقل ۸ کاراکتر"
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
                        setShowPassword((prev) => !prev)
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-gray-10"
                  >
                    تکرار رمز عبور
                  </label>

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
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="تکرار رمز عبور"
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
                        showConfirmPassword
                          ? "مخفی کردن رمز عبور"
                          : "نمایش رمز عبور"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
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
                      {showConfirmPassword ? (
                        <FiEyeOff size={19} />
                      ) : (
                        <FiEye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-7">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(event) =>
                      setAgreeToTerms(event.target.checked)
                    }
                    className="
                      mt-1
                      h-4 w-4
                      shrink-0
                      cursor-pointer
                      accent-primary
                    "
                  />

                  <span>
                    با ثبت‌نام در سقفینو با{" "}
                    <Link
                      href="#"
                      className="font-bold text-primary hover:underline"
                    >
                      قوانین و شرایط استفاده
                    </Link>{" "}
                    موافقم.
                  </span>
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
                    ? "در حال ایجاد حساب..."
                    : "ایجاد حساب کاربری"}
                </button>
              </form>

              {/* Login */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-4" />

                <span className="text-xs text-gray-6">
                  قبلاً حساب ساخته‌اید؟
                </span>

                <div className="h-px flex-1 bg-gray-4" />
              </div>

              <Link
                href="/login"
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
                ورود به حساب کاربری
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
