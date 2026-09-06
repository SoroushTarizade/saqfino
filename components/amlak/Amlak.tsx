"use client";

import Image from "next/image";
import { useState } from "react";
import { FiPhone, FiSearch, FiX } from "react-icons/fi";

type RealEstate = {
  id: number;
  name: string;
  location: string;
  satisfaction: string;
  activeAds: string;
  phone: string;
  logo: string;
};

const realEstates: RealEstate[] = [
  {
    id: 1,
    name: "مشاور املاک ولیعصر",
    location: "تهران، خیابان ولیعصر",
    satisfaction: "۴ از ۵",
    activeAds: "بیش از ۲۰۰۰",
    phone: "۰۲۱-۸۸۷۷۶۶۵۵",
    logo: "/images/RealEstate1.png",
  },
  {
    id: 2,
    name: "مشاور املاک پایتخت",
    location: "تهران، سعادت‌آباد",
    satisfaction: "۴.۵ از ۵",
    activeAds: "بیش از ۱۵۰۰",
    phone: "۰۲۱-۲۲۳۴۵۶۷۸",
    logo: "/images/RealEstate3.png",
  },
  {
    id: 3,
    name: "املاک مرکزی تهران",
    location: "تهران، یوسف‌آباد",
    satisfaction: "۴ از ۵",
    activeAds: "بیش از ۱۲۰۰",
    phone: "۰۲۱-۸۸۵۵۴۴۳۳",
    logo: "/images/RealEstate2.png",
  },
  {
    id: 4,
    name: "املاک ایرانیان",
    location: "تهران، نیاوران",
    satisfaction: "۴.۷ از ۵",
    activeAds: "بیش از ۱۸۰۰",
    phone: "۰۲۱-۲۲۷۷۸۸۹۹",
    logo: "/images/default.png",
  },
  {
    id: 5,
    name: "املاک شمال تهران",
    location: "تهران، تجریش",
    satisfaction: "۴.۶ از ۵",
    activeAds: "بیش از ۹۰۰",
    phone: "۰۲۱-۲۲۷۱۲۳۴۵",
    logo: "/images/RealEstate1.png",
  },
  {
    id: 6,
    name: "املاک مدرن",
    location: "تهران، ونک",
    satisfaction: "۴.۳ از ۵",
    activeAds: "بیش از ۱۱۰۰",
    phone: "۰۲۱-۸۸۶۶۷۷۸۸",
    logo: "/images/RealEstate3.png",
  },
  {
    id: 7,
    name: "املاک آریا",
    location: "تهران، فرمانیه",
    satisfaction: "۴.۸ از ۵",
    activeAds: "بیش از ۷۰۰",
    phone: "۰۲۱-۲۲۲۳۴۵۶۷",
    logo: "/images/RealEstate2.png",
  },
  {
    id: 8,
    name: "املاک خانه سبز",
    location: "تهران، پاسداران",
    satisfaction: "۴.۴ از ۵",
    activeAds: "بیش از ۸۰۰",
    phone: "۰۲۱-۲۲۵۵۶۶۷۷",
    logo: "/images/default.png",
  },
];

export default function Amlak() {
  const [selectedEstate, setSelectedEstate] =
    useState<RealEstate | null>(null);

  const [search, setSearch] = useState("");

  const filteredEstates = realEstates.filter((estate) => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return (
      estate.name.toLowerCase().includes(searchValue) ||
      estate.location.toLowerCase().includes(searchValue)
    );
  });

  return (
    <>
      <main
        dir="rtl"
        className="w-full"
      >
        <section className="mx-auto w-full max-w-[1224px] px-4 pb-10 pt-24 md:px-6 md:pt-24 lg:px-0 lg:pt-10">
          <h1 className="text-2xl font-bold text-gray-11 md:text-3xl">
            املاک و مستغلات
          </h1>

          <div className="relative mt-5 w-full max-w-[600px]">
            <FiSearch
              className="
                pointer-events-none absolute right-4 top-1/2
                h-5 w-5 -translate-y-1/2 text-gray-8
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                h-14 w-full rounded-lg border border-gray-4
                bg-white pr-12 pl-4 text-sm text-gray-11
                outline-none transition
                placeholder:text-gray-7
                focus:border-primary
              "
              placeholder="شهر مورد نظر را جستجو کنید..."
            />
          </div>

          {filteredEstates.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredEstates.map((estate) => (
                <button
                  key={estate.id}
                  type="button"
                  onClick={() =>
                    setSelectedEstate(estate)
                  }
                  className="
                    group w-full rounded-xl border border-gray-4
                    bg-white p-5 text-right
                    transition duration-300
                    hover:-translate-y-1
                    hover:border-primary/30
                    hover:shadow-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-primary/20
                  "
                >
                  <div className="flex h-[80px] items-center justify-center">
                    <Image
                      src={estate.logo}
                      alt={estate.name}
                      width={94}
                      height={64}
                      className="
                        max-h-16 w-auto object-contain
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    />
                  </div>

                  <div className="mt-5 text-center">
                    <h2 className="text-base font-bold text-gray-12">
                      {estate.name}
                    </h2>

                    <p className="mt-3 text-sm text-gray-8">
                      {estate.location}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-gray-4 pt-5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-8">
                        میزان رضایتمندی
                      </span>

                      <span className="font-bold text-gray-11">
                        {estate.satisfaction}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-8">
                        آگهی‌های فعال
                      </span>

                      <span className="font-bold text-gray-11">
                        {estate.activeAds}
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                      mt-5 text-center text-sm font-bold
                      text-primary transition
                      group-hover:opacity-70
                    "
                  >
                    مشاهده اطلاعات و شماره تماس
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-gray-4 p-10 text-center">
              <p className="font-bold text-gray-11">
                ملکی با این مشخصات پیدا نشد.
              </p>

              <p className="mt-2 text-sm text-gray-8">
                عبارت جستجو را تغییر دهید و دوباره امتحان کنید.
              </p>
            </div>
          )}
        </section>
      </main>

      {selectedEstate && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/50 px-4 py-6
            backdrop-blur-[2px]
          "
          onClick={() => setSelectedEstate(null)}
        >
          <div
            dir="rtl"
            className="
              relative w-full max-w-[420px]
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
                setSelectedEstate(null)
              }
              className="
                absolute left-4 top-4
                flex h-9 w-9 items-center justify-center
                rounded-full bg-gray-3 text-gray-10
                transition hover:bg-primary-tint-1
                hover:text-primary
              "
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center pt-3">
              <div
                className="
                  flex h-24 w-24 items-center justify-center
                  rounded-xl border border-gray-4
                  bg-white
                "
              >
                <Image
                  src={selectedEstate.logo}
                  alt={selectedEstate.name}
                  width={94}
                  height={64}
                  className="max-h-16 w-auto object-contain"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-12">
                {selectedEstate.name}
              </h2>

              <p className="mt-2 text-sm text-gray-8">
                {selectedEstate.location}
              </p>

              <a
                href={`tel:${selectedEstate.phone.replace(
                  /[^0-9+]/g,
                  "",
                )}`}
                className="
                  mt-7 flex h-12 w-full items-center
                  justify-center gap-2 rounded-lg
                  bg-primary font-bold text-white
                  transition hover:bg-primary-shade-1
                "
              >
                <FiPhone className="h-5 w-5" />

                <span dir="ltr">
                  {selectedEstate.phone}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};