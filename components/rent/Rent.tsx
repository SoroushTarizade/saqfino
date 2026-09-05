"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FaFilter, FaStar } from "react-icons/fa";
import {
  FiBookmark,
  FiChevronDown,
  FiHeart,
  FiMap,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";

import { properties, type Property } from "@/data/properties";

const RentMap = dynamic(() => import("./RentMap"), {
  ssr: false,
});

type Office = {
  id: number;
  image: string;
  name: string;
  address: string;
  rating: number;
  activeAds: string;
};

const offices: Office[] = [
  {
    id: 1,
    image: "/images/default.png",
    name: "مشاور املاک البرز",
    address: "تهران، خیابان ولیعصر",
    rating: 4,
    activeAds: "بیش از ۲۰۰۰",
  },
  {
    id: 2,
    image: "/images/RealEstate1.png",
    name: "املاک پایتخت",
    address: "تهران، سعادت‌آباد",
    rating: 4.5,
    activeAds: "بیش از ۱۵۰۰",
  },
  {
    id: 3,
    image: "/images/default.png",
    name: "املاک مرکزی",
    address: "تهران، یوسف‌آباد",
    rating: 4,
    activeAds: "بیش از ۱۰۰۰",
  },
  {
    id: 4,
    image: "/images/RealEstate1.png",
    name: "خانه ایرانی",
    address: "تهران، ونک",
    rating: 4.5,
    activeAds: "بیش از ۸۰۰",
  },
];

const districts = [
  "همه مناطق",
  "منطقه ۱",
  "منطقه ۲",
  "منطقه ۶",
];

const propertyTypes = [
  "همه انواع",
  "آپارتمان",
  "خانه",
  "ویلا",
  "دفتر کار",
];

const prices = [
  "همه قیمت‌ها",
  "زیر ۲۰ میلیون",
  "۲۰ تا ۳۰ میلیون",
  "۳۰ تا ۵۰ میلیون",
  "بالای ۵۰ میلیون",
];

const areas = [
  "همه متراژها",
  "زیر ۸۰ متر",
  "۸۰ تا ۱۲۰ متر",
  "۱۲۰ تا ۱۵۰ متر",
  "بالای ۱۵۰ متر",
];

type FilterDropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterDropdown({
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative min-w-[130px] flex-1 sm:flex-none">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-12
          w-full
          appearance-none
          rounded-md
          border
          border-gray-5
          bg-white
          px-4
          pl-10
          text-sm
          text-gray-11
          outline-none
          transition
          hover:border-gray-7
          focus:border-primary
          focus:ring-2
          focus:ring-primary/10
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <FiChevronDown
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-gray-8
        "
      />
    </div>
  );
}

type PropertyCardProps = {
  property: Property;
  bookmarked: boolean;
  onBookmark: (id: number) => void;
  onSelect: (property: Property) => void;
};

function PropertyCard({
  property,
  bookmarked,
  onBookmark,
  onSelect,
}: PropertyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    onSelect(property);
    router.push(`/rent/${property.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-lg
        border
        border-gray-5
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-xl
      "
    >
      <div className="relative overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          width={288}
          height={167}
          className="
            h-[167px]
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onBookmark(property.id);
          }}
          aria-label="ذخیره آگهی"
          className="
            absolute
            left-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-gray-10
            shadow-md
            transition-all
            hover:scale-110
            hover:text-primary
          "
        >
          {bookmarked ? (
            <FiHeart className="h-5 w-5 fill-primary text-primary" />
          ) : (
            <FiBookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex min-h-[150px] flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-gray-12">
            {property.title}
          </span>

          <span className="shrink-0 rounded-full bg-primary-tint-1 px-2 py-1 text-xs text-primary">
            {property.type}
          </span>
        </div>

        <p className="text-sm text-gray-9">
          {property.area.toLocaleString("fa-IR")} متر،{" "}
          {property.location}
        </p>

        <div className="mt-auto space-y-1 text-sm text-gray-11">
          <p>
            {property.deposit.toLocaleString("fa-IR")} میلیون تومان رهن
          </p>

          <p>
            {property.rent.toLocaleString("fa-IR")} میلیون تومان اجاره
          </p>
        </div>
      </div>
    </article>
  );
}

function OfficeCard({ office }: { office: Office }) {
  return (
    <article
      className="
        group
        flex
        min-w-[270px]
        flex-1
        flex-col
        items-center
        rounded-lg
        bg-white
        p-6
        text-center
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="relative mb-4 h-[66px] w-[94px] overflow-hidden rounded-md">
        <Image
          src={office.image}
          alt={office.name}
          fill
          sizes="94px"
          className="object-cover"
        />
      </div>

      <h4 className="text-lg font-bold text-gray-12">
        {office.name}
      </h4>

      <div className="mt-4 space-y-2 text-sm text-gray-9">
        <p>{office.address}</p>

        <div className="flex items-center justify-center gap-1">
          <span>میزان رضایتمندی:</span>

          <span className="font-bold text-gray-11">
            {office.rating.toLocaleString("fa-IR")} از ۵
          </span>

          <FaStar className="text-warning-light-1" />
        </div>

        <p>
          آگهی‌های فعال:{" "}
          <span className="font-bold text-gray-11">
            {office.activeAds}
          </span>
        </p>
      </div>

      <button
        type="button"
        className="
          mt-5
          rounded-md
          border
          border-primary
          px-4
          py-2
          text-sm
          font-bold
          text-primary
          transition-all
          duration-200
          hover:bg-primary
          hover:text-white
        "
      >
        مشاهده نظرات کاربران
      </button>
    </article>
  );
}

export default function Rent() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("همه مناطق");
  const [propertyType, setPropertyType] = useState("همه انواع");
  const [price, setPrice] = useState("همه قیمت‌ها");
  const [area, setArea] = useState("همه متراژها");
  const [sort, setSort] = useState("جدیدترین");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const normalizedSearch = search.trim();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.location.includes(normalizedSearch) ||
        property.title.includes(normalizedSearch);

      const matchesDistrict =
        district === "همه مناطق" ||
        property.district === district;

      const matchesType =
        propertyType === "همه انواع" ||
        property.type === propertyType;

      let matchesPrice = true;

      if (price === "زیر ۲۰ میلیون") {
        matchesPrice = property.rent < 20;
      }

      if (price === "۲۰ تا ۳۰ میلیون") {
        matchesPrice =
          property.rent >= 20 &&
          property.rent <= 30;
      }

      if (price === "۳۰ تا ۵۰ میلیون") {
        matchesPrice =
          property.rent > 30 &&
          property.rent <= 50;
      }

      if (price === "بالای ۵۰ میلیون") {
        matchesPrice = property.rent > 50;
      }

      let matchesArea = true;

      if (area === "زیر ۸۰ متر") {
        matchesArea = property.area < 80;
      }

      if (area === "۸۰ تا ۱۲۰ متر") {
        matchesArea =
          property.area >= 80 &&
          property.area <= 120;
      }

      if (area === "۱۲۰ تا ۱۵۰ متر") {
        matchesArea =
          property.area > 120 &&
          property.area <= 150;
      }

      if (area === "بالای ۱۵۰ متر") {
        matchesArea = property.area > 150;
      }

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesType &&
        matchesPrice &&
        matchesArea
      );
    });

    if (sort === "ارزان‌ترین") {
      result = [...result].sort(
        (a, b) => a.rent - b.rent,
      );
    }

    if (sort === "گران‌ترین") {
      result = [...result].sort(
        (a, b) => b.rent - a.rent,
      );
    }

    if (sort === "جدیدترین") {
      result = [...result].sort(
        (a, b) => b.createdAt - a.createdAt,
      );
    }

    return result;
  }, [
    search,
    district,
    propertyType,
    price,
    area,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setDistrict("همه مناطق");
    setPropertyType("همه انواع");
    setPrice("همه قیمت‌ها");
    setArea("همه متراژها");
    setSelectedProperty(null);
  };

  const toggleBookmark = (id: number) => {
    setBookmarked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <section
        className="
          mx-auto
          w-full
          max-w-[1224px]
          px-4
          pb-6
          pt-24
          md:px-6
          md:pt-24
          lg:px-0
          lg:pt-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            rounded-xl
            border
            border-gray-5
            bg-white
            p-4
            shadow-sm
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="relative w-full lg:w-[500px]">
            <FiSearch
              className="
                absolute
                right-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-gray-8
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="شهر یا محله مورد نظر را اضافه کنید"
              className="
                h-12
                w-full
                rounded-md
                border
                border-gray-5
                bg-gray-3
                pr-12
                pl-4
                text-sm
                text-gray-12
                outline-none
                transition
                focus:border-primary
                focus:bg-white
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <FilterDropdown
              value={district}
              options={districts}
              onChange={setDistrict}
            />

            <FilterDropdown
              value={propertyType}
              options={propertyTypes}
              onChange={setPropertyType}
            />

            <FilterDropdown
              value={price}
              options={prices}
              onChange={setPrice}
            />

            <FilterDropdown
              value={area}
              options={areas}
              onChange={setArea}
            />

            <button
              type="button"
              onClick={() =>
                setShowMoreFilters((current) => !current)
              }
              className="
                flex
                h-12
                flex-1
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-gray-5
                px-4
                text-sm
                font-bold
                text-gray-11
                transition-all
                hover:border-primary
                hover:text-primary
                sm:flex-none
              "
            >
              <FiSliders />
              فیلترهای بیشتر
            </button>
          </div>
        </div>

        {showMoreFilters && (
          <div
            className="
              mt-3
              rounded-xl
              border
              border-gray-5
              bg-gray-3
              p-5
              shadow-sm
            "
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-bold text-gray-12">
                  فیلترهای بیشتر
                </h3>

                <p className="mt-1 text-sm text-gray-8">
                  برای پیدا کردن ملک مناسب، فیلترهای مورد نظر
                  خود را انتخاب کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-bold
                  text-primary
                  transition
                  hover:opacity-70
                "
              >
                <FiX />
                حذف همه فیلترها
              </button>
            </div>
          </div>
        )}
      </section>

      <main
        className="
          mx-auto
          grid
          w-full
          max-w-[1224px]
          gap-6
          px-4
          pb-16
          md:px-6
          lg:grid-cols-[1fr_1fr]
          lg:px-0
        "
      >
        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-13">
                املاک اجاره‌ای
              </h1>

              <p className="mt-1 text-sm text-gray-8">
                {filteredProperties.length.toLocaleString("fa-IR")} مورد
                یافت شد
              </p>
            </div>

            <div className="relative w-full sm:w-[160px]">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-md
                  border
                  border-gray-5
                  bg-white
                  px-4
                  pl-9
                  text-sm
                  text-gray-11
                  outline-none
                  focus:border-primary
                "
              >
                <option value="جدیدترین">جدیدترین</option>
                <option value="ارزان‌ترین">ارزان‌ترین</option>
                <option value="گران‌ترین">گران‌ترین</option>
              </select>

              <FiChevronDown
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-8
                "
              />
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  bookmarked={bookmarked.includes(property.id)}
                  onBookmark={toggleBookmark}
                  onSelect={setSelectedProperty}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-gray-5
                px-6
                text-center
              "
            >
              <FaFilter className="mb-4 h-8 w-8 text-gray-7" />

              <h3 className="font-bold text-gray-12">
                ملکی با این مشخصات پیدا نشد
              </h3>

              <p className="mt-2 text-sm text-gray-8">
                فیلترها را تغییر دهید یا جست‌وجوی دیگری انجام دهید.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-5
                  rounded-md
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-primary-shade-1
                "
              >
                حذف فیلترها
              </button>
            </div>
          )}
        </section>

        <section className="order-first lg:order-none">
          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-gray-5
              bg-gray-3
              lg:sticky
              lg:top-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-5
                bg-white
                px-4
                py-3
              "
            >
              <div className="flex items-center gap-2">
                <FiMap className="text-primary" />

                <span className="font-bold text-gray-12">
                  موقعیت املاک
                </span>
              </div>

              <span className="text-xs text-gray-8">
                تهران
              </span>
            </div>

            <div className="h-[350px] sm:h-[450px] lg:h-[751px]">
              <RentMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onSelectProperty={setSelectedProperty}
              />
            </div>

            {selectedProperty && (
              <div className="border-t border-gray-5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={selectedProperty.image}
                      alt={selectedProperty.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-12">
                      {selectedProperty.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-8">
                      {selectedProperty.area.toLocaleString("fa-IR")} متر،
                      {" "}
                      {selectedProperty.location}
                    </p>

                    <p className="mt-1 text-xs font-bold text-primary">
                      {selectedProperty.rent.toLocaleString("fa-IR")} میلیون
                      تومان اجاره
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <section className="mx-auto mb-16 w-full max-w-[1224px] px-4 md:px-6 lg:px-0">
        <div className="rounded-xl bg-gray-4/60 p-4 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-primary" />

            <h2 className="text-xl font-bold text-gray-12 md:text-2xl">
              دفاتر املاک مرتبط
            </h2>
          </div>

          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-2
              lg:grid
              lg:grid-cols-4
              lg:overflow-visible
            "
          >
            {offices.map((office) => (
              <OfficeCard
                key={office.id}
                office={office}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}