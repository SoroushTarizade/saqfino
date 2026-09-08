"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMail,
  FiPlus,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female";
  avatar?: string;
  emailVerified: boolean;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!data.success || !data.user) {
          window.location.href = "/login";
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile loading error:", error);
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const avatarSrc =
    user?.avatar ||
    (user?.gender === "female"
      ? "/images/female-avatar.png"
      : "/images/male-avatar.png");

  if (isLoading) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-white pb-16 pt-[96px] lg:pt-10">
          <div className="mx-auto w-full max-w-[1224px] px-4 md:px-6">
            <div className="mx-auto max-w-[900px]">
              <div className="animate-pulse">
                <div className="h-8 w-32 rounded-lg bg-gray-3" />

                <div className="mt-3 h-5 w-64 rounded-lg bg-gray-3" />

                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-4">
                  <div className="h-36 bg-gray-3 md:h-44" />

                  <div className="px-5 py-6 md:px-8">
                    <div className="h-7 w-40 rounded-lg bg-gray-3" />

                    <div className="mt-3 h-5 w-60 rounded-lg bg-gray-3" />

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      <div className="h-20 rounded-xl bg-gray-3" />
                      <div className="h-20 rounded-xl bg-gray-3" />
                      <div className="h-20 rounded-xl bg-gray-3" />
                      <div className="h-20 rounded-xl bg-gray-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-16 pt-[96px] lg:pt-10">
        <div className="mx-auto w-full max-w-[1224px] px-4 md:px-6">
          <div className="mx-auto max-w-[900px]">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-10 md:text-3xl">
                پروفایل من
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-7 md:text-base">
                اطلاعات حساب کاربری و دسترسی‌های خود را مدیریت کنید.
              </p>
            </div>

            {/* Main Profile Card */}
            <section className="overflow-hidden rounded-2xl border border-gray-4 bg-white">
              {/* Cover */}
              <div className="relative h-36 bg-[#CB1B1B] md:h-44">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -left-10 -top-20 h-52 w-52 rounded-full border-[30px] border-white" />
                  <div className="absolute -bottom-32 right-10 h-64 w-64 rounded-full border-[35px] border-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-5 pb-7 md:px-8 md:pb-8">
                {/* Avatar */}
                <div className="-mt-12 mb-5 flex justify-start">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-3 shadow-lg md:h-28 md:w-28">
                    <Image
                      src={avatarSrc}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name + Email */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-10 md:text-2xl">
                      {user.firstName} {user.lastName}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-7">
                      <FiMail size={16} />

                      <span dir="ltr">{user.email}</span>
                    </div>
                  </div>

                  <Link
                    href="/profile/settings"
                    className="
                      flex
                      h-11
                      w-fit
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-4
                      px-4
                      text-sm
                      font-bold
                      text-gray-10
                      transition-all
                      duration-200
                      hover:border-[#CB1B1B]
                      hover:bg-[#FEF2F2]
                      hover:text-[#CB1B1B]
                    "
                  >
                    <FiSettings size={18} />

                    <span>تنظیمات حساب</span>
                  </Link>
                </div>

                {/* Verification Status */}
                <div className="mt-7 rounded-xl border border-gray-4 bg-gray-3 p-4 md:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <FiCheckCircle size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-10">
                          وضعیت حساب
                        </p>

                        <p className="mt-1 text-xs text-gray-7">
                          {user.emailVerified
                            ? "ایمیل حساب کاربری شما تأیید شده است."
                            : "ایمیل حساب کاربری شما هنوز تأیید نشده است."}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`hidden rounded-full px-3 py-1.5 text-xs font-bold sm:block ${
                        user.emailVerified
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.emailVerified
                        ? "تأیید شده"
                        : "تأیید نشده"}
                    </span>
                  </div>
                </div>

                {/* Account Information */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-10 md:text-lg">
                    اطلاعات حساب
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {/* First Name */}
                    <div className="rounded-xl border border-gray-4 p-4 transition-colors duration-200 hover:border-gray-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B]">
                          <FiUser size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-7">
                            نام
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-gray-10">
                            {user.firstName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="rounded-xl border border-gray-4 p-4 transition-colors duration-200 hover:border-gray-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B]">
                          <FiUser size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-7">
                            نام خانوادگی
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-gray-10">
                            {user.lastName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl border border-gray-4 p-4 transition-colors duration-200 hover:border-gray-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B]">
                          <FiMail size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-7">
                            ایمیل
                          </p>

                          <p
                            dir="ltr"
                            className="mt-1 truncate text-left text-sm font-bold text-gray-10"
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="rounded-xl border border-gray-4 p-4 transition-colors duration-200 hover:border-gray-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B]">
                          <FiUser size={19} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-7">
                            جنسیت
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-10">
                            {user.gender === "female"
                              ? "زن"
                              : "مرد"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Access */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-10 md:text-lg">
                    دسترسی سریع
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {/* My Ads */}
                    <Link
                      href="/profile/ads"
                      className="
                        group
                        rounded-xl
                        border
                        border-gray-4
                        p-5
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:border-[#CB1B1B]
                        hover:shadow-md
                      "
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B] transition-colors duration-200 group-hover:bg-[#CB1B1B] group-hover:text-white">
                        <HiOutlineClipboardDocumentList size={22} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-gray-10">
                        آگهی‌های من
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-7">
                        <span>مشاهده آگهی‌های ثبت‌شده</span>

                        <FiArrowLeft
                          size={14}
                          className="transition-transform duration-200 group-hover:-translate-x-1"
                        />
                      </div>
                    </Link>

                    {/* Settings */}
                    <Link
                      href="/profile/settings"
                      className="
                        group
                        rounded-xl
                        border
                        border-gray-4
                        p-5
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:border-[#CB1B1B]
                        hover:shadow-md
                      "
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B] transition-colors duration-200 group-hover:bg-[#CB1B1B] group-hover:text-white">
                        <FiSettings size={21} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-gray-10">
                        تنظیمات حساب
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-7">
                        <span>مدیریت اطلاعات حساب</span>

                        <FiArrowLeft
                          size={14}
                          className="transition-transform duration-200 group-hover:-translate-x-1"
                        />
                      </div>
                    </Link>

                    {/* Submit Ad */}
                    <Link
                      href="/submit"
                      className="
                        group
                        rounded-xl
                        border
                        border-gray-4
                        p-5
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:border-[#CB1B1B]
                        hover:shadow-md
                      "
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#CB1B1B] transition-colors duration-200 group-hover:bg-[#CB1B1B] group-hover:text-white">
                        <FiPlus size={22} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-gray-10">
                        ثبت آگهی جدید
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-7">
                        <span>ثبت ملک جدید</span>

                        <FiArrowLeft
                          size={14}
                          className="transition-transform duration-200 group-hover:-translate-x-1"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}