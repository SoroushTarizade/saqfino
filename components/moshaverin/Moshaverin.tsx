"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiPhone,
  FiStar,
  FiUser,
  FiX,
} from "react-icons/fi";

type Consultant = {
  id: number;
  name: string;
  agency: string;
  image: string;
  rating: number;
  experience: string;
  transactions: string;
  specialty: string;
  phone: string;
};

const consultants: Consultant[] = [
  {
    id: 1,
    name: "علی رضایی",
    agency: "مشاور املاک ولیعصر",
    image: "/images/Ellipse1.png",
    rating: 4.9,
    experience: "۸ سال",
    transactions: "بیش از ۳۲۰ معامله",
    specialty: "خرید و فروش آپارتمان",
    phone: "۰۲۱-۸۸۷۷۶۶۵۵",
  },
  {
    id: 2,
    name: "سارا محمدی",
    agency: "املاک پایتخت",
    image: "/images/Ellipse2.png",
    rating: 4.8,
    experience: "۶ سال",
    transactions: "بیش از ۲۴۰ معامله",
    specialty: "املاک لوکس",
    phone: "۰۲۱-۲۲۳۴۵۶۷۸",
  },
  {
    id: 3,
    name: "محمد رضایی",
    agency: "املاک مرکزی تهران",
    image: "/images/Ellipse3.png",
    rating: 4.7,
    experience: "۷ سال",
    transactions: "بیش از ۲۸۰ معامله",
    specialty: "خرید و فروش مسکونی",
    phone: "۰۲۱-۸۸۵۵۴۴۳۳",
  },
  {
    id: 4,
    name: "نگار احمدی",
    agency: "املاک ایرانیان",
    image: "/images/Ellipse4.png",
    rating: 4.9,
    experience: "۵ سال",
    transactions: "بیش از ۱۹۰ معامله",
    specialty: "اجاره و رهن",
    phone: "۰۲۱-۲۲۷۷۸۸۹۹",
  },
  {
    id: 5,
    name: "امیرحسین کریمی",
    agency: "املاک شمال تهران",
    image: "/images/Ellipse5.png",
    rating: 4.6,
    experience: "۹ سال",
    transactions: "بیش از ۳۸۰ معامله",
    specialty: "املاک شمال تهران",
    phone: "۰۲۱-۲۲۷۱۲۳۴۵",
  },
  {
    id: 6,
    name: "مریم حسینی",
    agency: "املاک مدرن",
    image: "/images/Ellipse6.png",
    rating: 4.8,
    experience: "۶ سال",
    transactions: "بیش از ۲۱۰ معامله",
    specialty: "آپارتمان‌های نوساز",
    phone: "۰۲۱-۸۸۶۶۷۷۸۸",
  },
  {
    id: 7,
    name: "رضا اکبری",
    agency: "املاک آریا",
    image: "/images/Ellipse1.png",
    rating: 4.5,
    experience: "۷ سال",
    transactions: "بیش از ۲۶۰ معامله",
    specialty: "خرید و فروش ملک",
    phone: "۰۲۱-۲۲۲۳۴۵۶۷",
  },
  {
    id: 8,
    name: "الهام مرادی",
    agency: "خانه سبز",
    image: "/images/Ellipse4.png",
    rating: 4.9,
    experience: "۵ سال",
    transactions: "بیش از ۱۸۰ معامله",
    specialty: "اجاره مسکونی",
    phone: "۰۲۱-۲۲۵۵۶۶۷۷",
  },
  {
    id: 9,
    name: "سعید موسوی",
    agency: "املاک ولیعصر",
    image: "/images/Ellipse2.png",
    rating: 4.6,
    experience: "۱۰ سال",
    transactions: "بیش از ۴۲۰ معامله",
    specialty: "املاک تجاری",
    phone: "۰۲۱-۸۸۷۱۲۳۴۵",
  },
  {
    id: 10,
    name: "فاطمه کریمی",
    agency: "املاک پایتخت",
    image: "/images/Ellipse5.png",
    rating: 4.8,
    experience: "۷ سال",
    transactions: "بیش از ۳۰۰ معامله",
    specialty: "خرید و فروش آپارتمان",
    phone: "۰۲۱-۲۲۳۸۸۷۷۶",
  },
  {
    id: 11,
    name: "حامد نادری",
    agency: "املاک مرکزی تهران",
    image: "/images/Ellipse3.png",
    rating: 4.7,
    experience: "۸ سال",
    transactions: "بیش از ۳۴۰ معامله",
    specialty: "ملک‌های سرمایه‌گذاری",
    phone: "۰۲۱-۸۸۵۱۲۳۴۵",
  },
  {
    id: 12,
    name: "بهاره موسوی",
    agency: "املاک ایرانیان",
    image: "/images/Ellipse6.png",
    rating: 4.9,
    experience: "۶ سال",
    transactions: "بیش از ۲۵۰ معامله",
    specialty: "املاک لوکس",
    phone: "۰۲۱-۲۲۷۴۵۶۷۸",
  },
  {
    id: 13,
    name: "مهدی احمدی",
    agency: "املاک مدرن",
    image: "/images/Ellipse1.png",
    rating: 4.6,
    experience: "۵ سال",
    transactions: "بیش از ۱۷۰ معامله",
    specialty: "آپارتمان نوساز",
    phone: "۰۲۱-۸۸۶۳۴۵۶۷",
  },
  {
    id: 14,
    name: "نیلوفر رضایی",
    agency: "املاک شمال تهران",
    image: "/images/Ellipse4.png",
    rating: 4.8,
    experience: "۸ سال",
    transactions: "بیش از ۳۱۰ معامله",
    specialty: "خرید و فروش در شمال تهران",
    phone: "۰۲۱-۲۲۷۸۹۰۱۲",
  },
  {
    id: 15,
    name: "آرش صادقی",
    agency: "املاک آریا",
    image: "/images/Ellipse5.png",
    rating: 4.7,
    experience: "۹ سال",
    transactions: "بیش از ۳۶۰ معامله",
    specialty: "خرید و فروش مسکونی",
    phone: "۰۲۱-۲۲۲۷۸۹۰۱",
  },
];

export default function Moshaverin() {
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>(null);

  return (
    <>
      <section
        dir="rtl"
        className="
          mx-auto w-full max-w-[1224px]
          px-4 pb-12 pt-24
          md:px-6
          lg:px-0 lg:pt-10
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-11 md:text-3xl">
            مشاورین املاک
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-8 md:text-base">
            با مشاورین حرفه‌ای و باتجربه سقفینو آشنا شوید.
          </p>
        </div>

        <div
          className="
            mt-8 grid grid-cols-1 gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {consultants.map((consultant) => (
            <article
              key={consultant.id}
              className="
                group rounded-xl border border-gray-4
                bg-white p-5
                transition duration-300
                hover:-translate-y-1
                hover:border-primary/30
                hover:shadow-lg
              "
            >
              <div className="flex flex-col items-center">
                <div
                  className="
                    relative h-[100px] w-[100px]
                    overflow-hidden rounded-full
                    border-2 border-primary-tint-2
                    bg-gray-3
                  "
                >
                  <Image
                    src={consultant.image}
                    alt={consultant.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>

                <h2 className="mt-5 text-base font-bold text-gray-12">
                  {consultant.name}
                </h2>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-8">
                  <FiBriefcase className="h-4 w-4 text-primary" />

                  <span>{consultant.agency}</span>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <FiStar className="h-4 w-4 fill-current text-primary" />

                  <span className="text-sm font-bold text-gray-11">
                    {consultant.rating.toLocaleString("fa-IR")}
                  </span>

                  <span className="text-xs text-gray-7">
                    از ۵
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedConsultant(consultant)
                }
                className="
                  mt-6 flex h-11 w-full items-center
                  justify-center gap-2 rounded-lg
                  border border-gray-4
                  text-sm font-bold text-gray-11
                  transition
                  hover:border-primary
                  hover:bg-primary-tint-1
                  hover:text-primary
                "
              >
                <FiUser className="h-4 w-4" />

                نمایش پروفایل
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedConsultant && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/50 px-4 py-6
            backdrop-blur-[2px]
          "
          onClick={() => setSelectedConsultant(null)}
        >
          <div
            dir="rtl"
            className="
              relative w-full max-w-[430px]
              rounded-2xl bg-white p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              aria-label="بستن"
              onClick={() =>
                setSelectedConsultant(null)
              }
              className="
                absolute left-4 top-4
                flex h-9 w-9 items-center
                justify-center rounded-full
                bg-gray-3 text-gray-10
                transition
                hover:bg-primary-tint-1
                hover:text-primary
              "
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center pt-2">
              <div
                className="
                  relative h-[110px] w-[110px]
                  overflow-hidden rounded-full
                  border-2 border-primary
                "
              >
                <Image
                  src={selectedConsultant.image}
                  alt={selectedConsultant.name}
                  fill
                  sizes="110px"
                  className="object-cover"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-12">
                {selectedConsultant.name}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-8">
                <FiBriefcase className="h-4 w-4 text-primary" />

                <span>{selectedConsultant.agency}</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <FiStar className="h-4 w-4 fill-current text-primary" />

                <span className="font-bold text-gray-11">
                  {selectedConsultant.rating.toLocaleString(
                    "fa-IR",
                  )}
                </span>

                <span className="text-sm text-gray-7">
                  از ۵
                </span>
              </div>

              <div className="mt-7 grid w-full grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-3 p-4 text-center">
                  <p className="text-xs text-gray-8">
                    سابقه فعالیت
                  </p>

                  <p className="mt-2 font-bold text-gray-12">
                    {selectedConsultant.experience}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-3 p-4 text-center">
                  <p className="text-xs text-gray-8">
                    معاملات موفق
                  </p>

                  <p className="mt-2 font-bold text-gray-12">
                    {selectedConsultant.transactions}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex w-full items-center gap-3 rounded-lg border border-gray-4 p-4">
                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-full bg-primary-tint-1
                  "
                >
                  <FiCheckCircle className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-gray-8">
                    حوزه تخصص
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-12">
                    {selectedConsultant.specialty}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${selectedConsultant.phone.replace(
                  /[^0-9+]/g,
                  "",
                )}`}
                className="
                  mt-5 flex h-12 w-full
                  items-center justify-center gap-2
                  rounded-lg bg-primary
                  font-bold text-white
                  transition
                  hover:bg-primary-shade-1
                "
              >
                <FiPhone className="h-5 w-5" />

                <span dir="ltr">
                  {selectedConsultant.phone}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


