"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigationItems = [
  { label: "اجاره", href: "/rent" },
  { label: "خرید", href: "/buy" },
  { label: "املاک و مستغلات", href: "/amlak" },
  { label: "مشاورین املاک", href: "/moshaverin" },
  { label: "اخبار روز", href: "/news" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Mobile / Tablet Header */}
      <header
        className="
          fixed inset-x-0 top-0 z-50
          flex h-[72px] w-full items-center
          border-b border-gray-4
          bg-white
          px-4
          lg:hidden
        "
      >
        <div className="relative flex w-full items-center justify-between">
          {/* Hamburger */}
          <button
            type="button"
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
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
                  ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}
                `}
              />

              <span
                className={`
                  block h-0.5 w-full rounded-full bg-current
                  transition-all duration-200
                  ${isMenuOpen ? "opacity-0" : ""}
                `}
              />

              <span
                className={`
                  block h-0.5 w-full rounded-full bg-current
                  transition-all duration-200
                  ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}
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
              src="/images/logo.png"
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
          ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}
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
          onClick={(event) => event.stopPropagation()}
        >
          <ul className="flex flex-col">
            {navigationItems.map((item, index) => (
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
                  <span>{item.label}</span>

                  <span
                    className="
                      mr-auto
                      text-gray-7
                      transition-transform duration-200
                      group-hover:-translate-x-1
                    "
                  >
                    ←
                  </span>
                </Link>
              </li>
            ))}

            <li className="pt-5">
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
              {navigationItems.map((item) => (
                <li key={item.href}>
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
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="
                font-bold
                transition-colors duration-200
                hover:text-primary
              "
            >
              ورود
            </Link>

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

