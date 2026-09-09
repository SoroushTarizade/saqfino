"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiEdit3,
  FiLock,
  FiLogOut,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

type Gender = "male" | "female" | "other" | "";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  avatar?: string;
  emailVerified: boolean;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender>("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [message, setMessage] = useState<Message>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          router.replace("/login");
          return;
        }

        setUser(data.user);
        setFirstName(data.user.firstName ?? "");
        setLastName(data.user.lastName ?? "");
        setGender(data.user.gender ?? "");
      } catch {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMessage({
        type: "error",
        text: "نام و نام خانوادگی را وارد کنید.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage({
          type: "error",
          text: data.message || "ذخیره اطلاعات انجام نشد.",
        });
        return;
      }

      setUser(data.user);

      setMessage({
        type: "success",
        text: "اطلاعات پروفایل با موفقیت ذخیره شد.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "خطایی رخ داد. دوباره تلاش کنید.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "لطفاً همه فیلدها را کامل کنید.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "تکرار رمز عبور با رمز جدید یکسان نیست.",
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPasswordMessage({
          type: "error",
          text: data.message || "تغییر رمز عبور انجام نشد.",
        });
        return;
      }

      setPasswordMessage({
        type: "success",
        text: "رمز عبور با موفقیت تغییر کرد.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordMessage(null);
      }, 1200);
    } catch {
      setPasswordMessage({
        type: "error",
        text: "خطایی رخ داد. دوباره تلاش کنید.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!user) return "س";

    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";

    return `${first}${last}` || "س";
  };

  if (isLoading) {
    return (
      <>
        <Header />

        <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1224px]">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-40 rounded-lg bg-gray-200" />
              <div className="h-40 rounded-2xl bg-white" />
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="h-96 rounded-2xl bg-white" />
                <div className="h-72 rounded-2xl bg-white" />
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

      <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1224px]">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="transition-colors hover:text-[#CB1B1B]"
            >
              صفحه اصلی
            </button>

            <FiArrowLeft className="text-xs" />

            <span className="text-gray-900">تنظیمات حساب</span>
          </div>

          {/* Profile Header */}
          <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#CB1B1B]/10 text-2xl font-bold text-[#CB1B1B] ring-4 ring-[#CB1B1B]/5">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>

                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {user.firstName} {user.lastName}
                    </h1>

                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                      <FiCheck size={12} />
                      تأیید شده
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{user.email}</p>

                  <p className="mt-2 text-xs text-gray-400">
                    اطلاعات حساب و تنظیمات امنیتی خود را مدیریت کنید.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <FiShield className="text-[#CB1B1B]" />
                حساب کاربری سقفینو
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Left */}
            <div className="space-y-6">
              {/* Personal Information */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB1B1B]/10 text-[#CB1B1B]">
                      <FiUser size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        اطلاعات شخصی
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        اطلاعات پایه حساب کاربری خود را ویرایش کنید.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 p-5 sm:p-7"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        نام
                      </label>

                      <div className="relative">
                        <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(event) =>
                            setFirstName(event.target.value)
                          }
                          className="h-12 w-full rounded-xl border border-gray-200 bg-white pr-11 pl-4 text-sm text-gray-900 outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                          placeholder="نام"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        نام خانوادگی
                      </label>

                      <div className="relative">
                        <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(event) =>
                            setLastName(event.target.value)
                          }
                          className="h-12 w-full rounded-xl border border-gray-200 bg-white pr-11 pl-4 text-sm text-gray-900 outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                          placeholder="نام خانوادگی"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      جنسیت
                    </label>

                    <select
                      id="gender"
                      value={gender}
                      onChange={(event) =>
                        setGender(event.target.value as Gender)
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      ایمیل
                    </label>

                    <div className="relative">
                      <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 text-sm text-gray-500 outline-none"
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      ایمیل حساب در حال حاضر قابل ویرایش نیست.
                    </p>
                  </div>

                  {/* Message */}
                  {message && (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm ${
                        message.type === "success"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {/* Save */}
                  <div className="flex justify-end border-t border-gray-100 pt-5">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#CB1B1B] px-6 text-sm font-bold text-white transition hover:bg-[#b81717] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSave size={17} />

                      {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Security */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                      <FiLock size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        امنیت حساب
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        تنظیمات امنیتی حساب خود را مدیریت کنید.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      رمز عبور
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-gray-400">
                      برای افزایش امنیت حساب، رمز عبور خود را به صورت دوره‌ای
                      تغییر دهید.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPasswordMessage(null);
                      setIsPasswordModalOpen(true);
                    }}
                    className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:border-[#CB1B1B] hover:text-[#CB1B1B]"
                  >
                    <FiEdit3 size={16} />
                    تغییر رمز عبور
                  </button>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Account Status */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 font-bold text-gray-900">
                  وضعیت حساب
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      وضعیت ایمیل
                    </span>

                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      تأیید شده
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      نوع حساب
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                      کاربر عادی
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      امنیت حساب
                    </span>

                    <span className="text-xs font-medium text-green-600">
                      فعال
                    </span>
                  </div>
                </div>
              </section>

              {/* Email */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <FiMail size={18} />
                </div>

                <h3 className="text-sm font-bold text-gray-900">
                  ایمیل حساب
                </h3>

                <p className="mt-2 break-all text-xs leading-6 text-gray-400">
                  {user.email}
                </p>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600">
                  <FiCheck size={13} />
                  ایمیل شما تأیید شده است.
                </div>
              </section>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiLogOut size={17} />

                {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CB1B1B]/10 text-[#CB1B1B]">
                  <FiLock size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    تغییر رمز عبور
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    یک رمز عبور امن انتخاب کنید.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordMessage(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  رمز عبور فعلی
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                  placeholder="رمز عبور فعلی"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  رمز عبور جدید
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                  placeholder="حداقل ۸ کاراکتر"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  تکرار رمز عبور جدید
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#CB1B1B] focus:ring-2 focus:ring-[#CB1B1B]/10"
                  placeholder="تکرار رمز عبور جدید"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#CB1B1B] text-sm font-bold text-white transition hover:bg-[#b81717] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiLock size={17} />

                {isChangingPassword
                  ? "در حال تغییر..."
                  : "تغییر رمز عبور"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}