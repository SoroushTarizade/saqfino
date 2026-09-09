"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";

export default function Footer() {
const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: "smooth",
});
};

return ( <footer className="w-full bg-gray-2 px-5 py-10 md:px-8 lg:px-10"> <div className="mx-auto w-full max-w-[1224px]">
{/* Top Section */} <div className="flex items-center justify-between">
{/* Logo */} <Image
         src="/images/logo.png"
         alt="سقفینو"
         width={64}
         height={32}
       />


      {/* Back To Top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="بازگشت به بالای صفحه"
        className="
          group
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-gray-5
          bg-white
          text-gray-10
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary
          hover:bg-primary
          hover:text-white
          active:scale-95
        "
      >
        <IoIosArrowUp
          className="
            h-5
            w-5
            transition-transform
            duration-300
            group-hover:-translate-y-0.5
          "
        />
      </button>
    </div>

    {/* Brand */}
    <div className="my-5 flex flex-col gap-2">
      <h4 className="text-[14px] font-bold text-gray-12">
        سقفینو؛ سقفی برای یک زندگی ایده‌آل
      </h4>

      <p className="text-[12px] text-gray-11">
        تجربه لذت خانه‌دار شدن آنی و آسان
      </p>
    </div>

    {/* Categories */}
    <div className="mb-4 flex items-center justify-between text-[10px] text-gray-11 md:text-[12px]">
      <span>بیشترین جست‌وجوها</span>
      <span>بازارهای املاک و مستغلات</span>
    </div>

    {/* Description */}
    <p className="max-w-[900px] text-justify text-[10px] leading-7 text-gray-9 md:text-[12px]">
      سقفینو پلی است تا به سرعت در بین هزاران آگهی ثبت‌شده جست‌وجو کنید.
      ملک مورد نظر را پیدا کنید و برای انجام معامله‌ای مطمئن، با مشاورین
      املاک معتمد و متخصص شهرتان در ارتباط باشید.
    </p>

    {/* Footer Navigation */}
    <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
      {/* Services */}
      <div>
        <h5 className="mb-4 text-[14px] font-bold text-gray-11">
          خدمات
        </h5>

        <ul className="flex flex-col gap-3 text-[10px] text-gray-9 md:text-[12px]">
          <li>
            <Link href="/rent" className="footer-link">
              اجاره
            </Link>
          </li>

          <li>
            <Link href="/buy" className="footer-link">
              خرید
            </Link>
          </li>

          <li>
            <Link href="/submit" className="footer-link">
              ثبت آگهی ملک
            </Link>
          </li>

          <li>
            <Link href="/amlak" className="footer-link">
              املاک
            </Link>
          </li>

          <li>
            <Link href="/moshaverin" className="footer-link">
              مشاورین املاک
            </Link>
          </li>

          <li>
            <Link href="/news" className="footer-link">
              اخبار روز املاک
            </Link>
          </li>

          <li>
            <Link href="/" className="footer-link">
              سوالات ملکی
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h5 className="mb-4 text-[14px] font-bold text-gray-11">
          ارتباط با ما
        </h5>

        <div className="flex items-center gap-3">
          {/* Phone */}
          <a
            href="tel:+989186547416"
            aria-label="تماس با سقفینو"
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-gray-5
              bg-white
              text-gray-9
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-primary
              hover:bg-primary
              hover:text-white
            "
          >
            <BsFillTelephoneFill className="h-4 w-4" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/soroush_tr9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام سقفینو"
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-gray-5
              bg-white
              text-gray-9
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-primary
              hover:bg-primary
              hover:text-white
            "
          >
            <FaInstagram className="h-5 w-5" />
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/soroush_tr9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام سقفینو"
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-gray-5
              bg-white
              text-gray-9
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-primary
              hover:bg-primary
              hover:text-white
            "
          >
            <RiTelegram2Fill className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* About */}
      <div>
        <h5 className="mb-4 text-[14px] font-bold text-gray-11">
          درباره سقفینو
        </h5>

        <ul className="flex flex-col gap-3 text-[10px] text-gray-9 md:text-[12px]">
          <li>
            <Link href="/contact" className="footer-link">
              تماس با ما
            </Link>
          </li>

          <li>
            <Link href="/about" className="footer-link">
              داستان سقفینو
            </Link>
          </li>

          <li>
            <Link href="/" className="footer-link">
              دانلود اپلیکیشن سقفینو
            </Link>
          </li>
        </ul>
      </div>

      {/* Developer */}
      <div>
        <h5 className="mb-4 text-[14px] font-bold text-gray-11">
          طراحی و توسعه
        </h5>

        <ul className="flex flex-col gap-3 text-[10px] text-gray-9 md:text-[12px]">
          <li>
            <a
              href="https://soroushtarizadeh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link transition-colors hover:text-primary"
            >
              پورتفولیو
            </a>
          </li>

          <li>
            <a
              href="https://github.com/SoroushTarizade"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link transition-colors hover:text-primary"
            >
              GitHub
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com/in/soroush-tarizadeh/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Footer Illustration */}
    <div className="mt-10 flex justify-center md:justify-start">
      <Image
        src="/images/footer.svg"
        alt="سقفینو"
        width={324}
        height={60}
      />
    </div>

    {/* Copyright */}
    <div className="mt-8 border-t border-gray-4 pt-5 text-center text-[10px] text-gray-8">
      تمامی حقوق این وب‌سایت متعلق به سقفینو است.
    </div>

    {/* Developer Credit */}
    <div className="mt-3 text-center text-[10px] text-gray-7">
      ساخته شده توسط{" "}
      <a
        href="https://soroushtarizadeh.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="
          font-bold
          text-gray-10
          transition-colors
          hover:text-primary
        "
      >
        Soroush Tarizadeh
      </a>
    </div>
  </div>
</footer>


);
}
