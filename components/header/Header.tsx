"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female";
  avatar: string;
  emailVerified: boolean;
};

const navigationItems = [
  { label: "اجاره", href: "/rent" },
  { label: "خرید", href: "/buy" },
  { label: "املاک و مستغلات", href: "/amlak" },
  { label: "مشاورین املاک", href: "/moshaverin" },
  { label: "اخبار روز", href: "/news" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [user, setUser] =
    useState<User | null>(null);

  const [isAuthLoading, setIsAuthLoading] =
    useState(true);

  const [isLogoutLoading, setIsLogoutLoading] =
    useState(false);

  const profileDropdownRef =
    useRef<HTMLDivElement | null>(null);

  const mobileProfileDropdownRef =
    useRef<HTMLDivElement | null>(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        closeProfileDropdown();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      const clickedDesktopDropdown =
        profileDropdownRef.current?.contains(
          target,
        );

      const clickedMobileDropdown =
        mobileProfileDropdownRef.current?.contains(
          target,
        );

      if (
        !clickedDesktopDropdown &&
        !clickedMobileDropdown
      ) {
        closeProfileDropdown();
      }
    };

    if (isProfileOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data =
          await response.json();

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Load current user error:",
          error,
        );

        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const getAvatarSrc = () => {
    if (user?.avatar) {
      return user.avatar;
    }

    if (user?.gender === "female") {
      return "/images/female-avatar.png";
    }

    return "/images/male-avatar.png";
  };

  const handleLogout = async () => {
    if (isLogoutLoading) {
      return;
    }

    try {
      setIsLogoutLoading(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "خروج از حساب کاربری انجام نشد.",
        );
      }

      setUser(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);

      window.location.href = "/";
    } catch (error) {
      console.error(
        "Logout error:",
        error,
      );

      alert(
        "خروج از حساب کاربری انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <>
      {/* Mobile / Tablet Header */}
      <header
        id="top"
        className="
          fixed inset-x-0 top-0 z-50
          flex h-[72px] w-full items-center
          border-b border-gray-4
          bg-white
          px-4
          lg:hidden
          z-[1000]
        "
      >
        <div className="relative flex w-full items-center justify-between">
          {/* Hamburger */}
          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "بستن منو"
                : "باز کردن منو"
            }
            aria-expanded={isMenuOpen}
            onClick={() =>
              setIsMenuOpen(
                (prev) => !prev,
              )
            }
            className="
              relative z-10
              flex h-10 w-10 items-center justify-center
              rounded-sm
              text-gray-10
              transition-all duration-200
              hover:bg-primary-tint-2
              hover:text-primary
              active:scale-95
            "
          >
            <span className="flex w-5 flex-col gap-[5px]">
              <span
                className={`
                  block h-0.5 w-full rounded-full bg-current
                  transition-all duration-200
                  ${
                    isMenuOpen
                      ? "translate-y-[7px] rotate-45"
                      : ""
                  }
                `}
              />

              <span
                className={`
                  block h-0.5 w-full rounded-full bg-current
                  transition-all duration-200
                  ${
                    isMenuOpen
                      ? "opacity-0"
                      : ""
                  }
                `}
              />

              <span
                className={`
                  block h-0.5 w-full rounded-full bg-current
                  transition-all duration-200
                  ${
                    isMenuOpen
                      ? "-translate-y-[7px] -rotate-45"
                      : ""
                  }
                `}
              />
            </span>
          </button>

          {/* Center Logo */}
          <Link
            href="/"
            aria-label="سقفینو"
            onClick={closeMenu}
            className="
              absolute left-1/2
              -translate-x-1/2
              transition-transform duration-200
              hover:scale-105
            "
          >
            <Image
              src="/favicon.png"
              alt="سقفینو"
              width={131}
              height={63}
              priority
              className="h-auto w-[92px] md:w-[110px]"
            />
          </Link>

          {/* Submit Button */}
          <Link
            href="/submit"
            onClick={closeMenu}
            className="
              submit-button
              flex h-10 w-[88px]
              items-center justify-center
              rounded-sm
              border border-primary
              text-sm font-bold

              md:h-11
              md:w-[96px]
              md:text-base
            "
          >
            ثبت آگهی
          </Link>
        </div>
      </header>

      {/* Mobile / Tablet Menu */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/30
          transition-opacity duration-300
          lg:hidden
          ${
            isMenuOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <nav
          className={`
            absolute right-0 top-[72px]
            w-full
            border-t border-gray-4
            bg-white
            px-5 py-6
            shadow-lg
            transition-transform duration-300
            md:max-w-[420px]
            ${
              isMenuOpen
                ? "translate-y-0"
                : "-translate-y-4"
            }
          `}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <ul className="flex flex-col">
            {navigationItems.map(
              (item) => (
                <li
                  key={item.href}
                  className="border-b border-gray-4 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="
                      flex items-center
                      py-4
                      text-base font-bold text-gray-10
                      transition-all duration-200
                      hover:pr-2
                      hover:text-primary
                    "
                  >
                    <span>
                      {item.label}
                    </span>

                    <span
                      className="
                        mr-auto
                        text-gray-7
                        transition-transform duration-200
                      "
                    >
                      ←
                    </span>
                  </Link>
                </li>
              ),
            )}

            <li className="pt-5">
              {user ? (
                <div
                  ref={
                    mobileProfileDropdownRef
                  }
                  className="relative"
                >
                  {/* Mobile User Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsProfileOpen(
                        (prev) => !prev,
                      )
                    }
                    aria-expanded={
                      isProfileOpen
                    }
                    className="
                      flex h-12 w-full
                      items-center
                      justify-between
                      rounded-sm
                      bg-gray-3
                      px-4
                      text-gray-10
                      font-bold
                      transition-all duration-200
                      hover:bg-primary-tint-2
                      hover:text-primary
                    "
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="
                          relative
                          flex h-8 w-8
                          shrink-0
                          overflow-hidden
                          rounded-full
                          bg-primary-tint-2
                        "
                      >
                        <Image
                          src={getAvatarSrc()}
                          alt={`${user.firstName} ${user.lastName}`}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </span>

                      <span>
                        {user.firstName}
                      </span>
                    </span>

                    <FiChevronDown
                      size={18}
                      className={`
                        transition-transform duration-200
                        ${
                          isProfileOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* Mobile Dropdown */}
                  <div
                    className={`
                      overflow-hidden
                      transition-all duration-200
                      ${
                        isProfileOpen
                          ? "mt-2 max-h-80 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden rounded-sm border border-gray-4 bg-white">
                      <Link
                        href="/profile"
                        onClick={() =>
                          setIsProfileOpen(
                            false,
                          )
                        }
                        className="
                          flex items-center gap-3
                          px-4 py-3
                          text-sm font-bold text-gray-10
                          transition-colors
                          hover:bg-gray-3
                          hover:text-primary
                        "
                      >
                        <FiUser size={18} />
                        <span>
                          پروفایل من
                        </span>
                      </Link>

                      <Link
                        href="/profile/ads"
                        onClick={() =>
                          setIsProfileOpen(
                            false,
                          )
                        }
                        className="
                          flex items-center gap-3
                          border-t border-gray-4
                          px-4 py-3
                          text-sm font-bold text-gray-10
                          transition-colors
                          hover:bg-gray-3
                          hover:text-primary
                        "
                      >
                        <HiOutlineClipboardDocumentList
                          size={19}
                        />
                        <span>
                          آگهی‌های من
                        </span>
                      </Link>

                      <Link
                        href="/profile/settings"
                        onClick={() =>
                          setIsProfileOpen(
                            false,
                          )
                        }
                        className="
                          flex items-center gap-3
                          border-t border-gray-4
                          px-4 py-3
                          text-sm font-bold text-gray-10
                          transition-colors
                          hover:bg-gray-3
                          hover:text-primary
                        "
                      >
                        <FiSettings
                          size={18}
                        />
                        <span>
                          تنظیمات
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        disabled={
                          isLogoutLoading
                        }
                        className="
                          flex w-full items-center gap-3
                          border-t border-gray-4
                          px-4 py-3
                          text-sm font-bold
                          text-red-600
                          transition-colors
                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <FiLogOut
                          size={18}
                        />

                        <span>
                          {isLogoutLoading
                            ? "در حال خروج..."
                            : "خروج از حساب"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="
                    flex h-12 w-full
                    items-center justify-center
                    rounded-sm
                    bg-gray-3
                    text-gray-10
                    font-bold
                    transition-all duration-200
                    hover:bg-primary-tint-2
                    hover:text-primary
                  "
                >
                  ورود
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop Header */}
      <header
        className="
          hidden
          lg:flex
          justify-center
          px-6
        "
      >
        <div
          className="
            relative
            mt-10
            flex h-[115px]
            w-full max-w-[1224px]
            items-center justify-between
            rounded-lg
            bg-gray-3
            px-10
            text-gray-10
          "
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="سقفینو"
            className="
              transition-transform duration-200
              hover:scale-105
            "
          >
            <Image
              src="/images/logo.png"
              alt="سقفینو"
              width={131}
              height={63}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav>
            <ul className="flex items-center gap-5">
              {navigationItems.map(
                (item) => (
                  <li
                    key={item.href}
                  >
                    <Link
                      href={item.href}
                      className="
                        relative
                        py-2
                        text-sm font-bold
                        transition-colors duration-200
                        hover:text-primary

                        after:absolute
                        after:bottom-0
                        after:right-0
                        after:h-[2px]
                        after:w-0
                        after:bg-primary
                        after:transition-all
                        after:duration-200
                        hover:after:w-full
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-5">
            {isAuthLoading ? (
              <div
                className="
                  h-6 w-16
                  animate-pulse
                  rounded-sm
                  bg-gray-4
                "
              />
            ) : user ? (
              <div
                ref={
                  profileDropdownRef
                }
                className="relative"
              >
                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(
                      (prev) => !prev,
                    )
                  }
                  aria-expanded={
                    isProfileOpen
                  }
                  className="
                    flex items-center gap-3
                    font-bold
                    transition-colors duration-200
                    hover:text-primary
                  "
                >
                  <span
                    className="
                      relative
                      flex h-10 w-10
                      shrink-0
                      overflow-hidden
                      rounded-full
                      bg-primary-tint-2
                    "
                  >
                    <Image
                      src={getAvatarSrc()}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>

                  <span>
                    {user.firstName}
                  </span>

                  <FiChevronDown
                    size={17}
                    className={`
                      transition-transform duration-200
                      ${
                        isProfileOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* Desktop Dropdown */}
                <div
                  className={`
                    absolute
                    left-1/2
                    top-[calc(100%+16px)]
                    z-[1100]
                    w-[220px]
                    -translate-x-1/2
                    origin-top
                    transition-all duration-200
                    ${
                      isProfileOpen
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-95 opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden rounded-lg border border-gray-4 bg-white shadow-lg">
                    {/* User Info */}
                    <div className="flex items-center gap-3 border-b border-gray-4 px-4 py-4">
                      <span
                        className="
                          relative
                          flex h-11 w-11
                          shrink-0
                          overflow-hidden
                          rounded-full
                        "
                      >
                        <Image
                          src={getAvatarSrc()}
                          alt={`${user.firstName} ${user.lastName}`}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-10">
                          {user.firstName}{" "}
                          {user.lastName}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-7">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile */}
                    <Link
                      href="/profile"
                      onClick={() =>
                        setIsProfileOpen(
                          false,
                        )
                      }
                      className="
                        flex items-center gap-3
                        px-4 py-3
                        text-sm font-bold text-gray-10
                        transition-colors
                        hover:bg-gray-3
                        hover:text-primary
                      "
                    >
                      <FiUser size={18} />

                      <span>
                        پروفایل من
                      </span>
                    </Link>

                    {/* My Ads */}
                    <Link
                      href="/profile/ads"
                      onClick={() =>
                        setIsProfileOpen(
                          false,
                        )
                      }
                      className="
                        flex items-center gap-3
                        border-t border-gray-4
                        px-4 py-3
                        text-sm font-bold text-gray-10
                        transition-colors
                        hover:bg-gray-3
                        hover:text-primary
                      "
                    >
                      <HiOutlineClipboardDocumentList
                        size={19}
                      />

                      <span>
                        آگهی‌های من
                      </span>
                    </Link>

                    {/* Settings */}
                    <Link
                      href="/profile/settings"
                      onClick={() =>
                        setIsProfileOpen(
                          false,
                        )
                      }
                      className="
                        flex items-center gap-3
                        border-t border-gray-4
                        px-4 py-3
                        text-sm font-bold text-gray-10
                        transition-colors
                        hover:bg-gray-3
                        hover:text-primary
                      "
                    >
                      <FiSettings
                        size={18}
                      />

                      <span>
                        تنظیمات
                      </span>
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      disabled={
                        isLogoutLoading
                      }
                      className="
                        flex w-full items-center gap-3
                        border-t border-gray-4
                        px-4 py-3
                        text-sm font-bold
                        text-red-600
                        transition-colors
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <FiLogOut
                        size={18}
                      />

                      <span>
                        {isLogoutLoading
                          ? "در حال خروج..."
                          : "خروج از حساب"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="
                  font-bold
                  transition-colors
                  duration-200
                  hover:text-primary
                "
              >
                ورود
              </Link>
            )}

            <Link
              href="/submit"
              className="
                submit-button
                flex h-12 w-[102px]
                items-center justify-center
                rounded-sm
                border border-primary
                font-bold
              "
            >
              ثبت آگهی
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}