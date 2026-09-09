"use client";

import { formatPrice } from "@/lib/formatPrice";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
} from "react";

import { FaFilter } from "react-icons/fa";

import {
  FiBookmark,
  FiChevronDown,
  FiHeart,
  FiMap,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";

const RentMap = dynamic(
  () => import("./RentMap"),
  {
    ssr: false,
  },
);

const districts = [
  "همه مناطق",
  "منطقه ۱",
  "منطقه ۲",
  "منطقه ۳",
  "منطقه ۶",
];

const propertyTypes = [
  "همه انواع",
  "آپارتمان",
  "خانه",
  "ویلا",
  "دفتر کار",
];

const deposits = [
  "همه ودیعه‌ها",
  "زیر ۵۰۰ میلیون",
  "۵۰۰ میلیون تا ۱ میلیارد",
  "۱ تا ۲ میلیارد",
  "بالای ۲ میلیارد",
];

const rents = [
  "همه اجاره‌ها",
  "زیر ۱۰ میلیون",
  "۱۰ تا ۲۰ میلیون",
  "۲۰ تا ۳۰ میلیون",
  "بالای ۳۰ میلیون",
];

const areas = [
  "همه متراژها",
  "زیر ۸۰ متر",
  "۸۰ تا ۱۲۰ متر",
  "۱۲۰ تا ۱۵۰ متر",
  "بالای ۱۵۰ متر",
];

const bedrooms = [
  "همه تعداد اتاق‌ها",
  "بدون اتاق",
  "۱ خواب",
  "۲ خواب",
  "۳ خواب",
  "۴ خواب و بیشتر",
];

const buildYears = [
  "همه سال‌ها",
  "۱۴۰۳ به بعد",
  "۱۴۰۰ تا ۱۴۰۲",
  "۱۳۹۵ تا ۱۳۹۹",
  "قبل از ۱۳۹۵",
];

type Property = {
  id: string;

  image: string;

  images: string[];

  title: string;

  location: string;

  district: string;

  deposit: number;

  rent: number;

  area: number;

  bedrooms: number;

  floor: number;

  totalFloors: number;

  yearBuilt: number;

  type: string;

  amenities: string[];

  description: string;

  lat: number;

  lng: number;

  createdAt?: string;

  transactionType?: "buy" | "rent";
};

type FilterDropdownProps = {
  value: string;

  options: string[];

  onChange: (
    value: string,
  ) => void;
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
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
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
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ),
        )}
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

  onBookmark: (
    id: string,
  ) => void;

  onSelect: (
    property: Property,
  ) => void;
};

function PropertyCard({
  property,
  bookmarked,
  onBookmark,
  onSelect,
}: PropertyCardProps) {
  return (
    <article
      onClick={() =>
        onSelect(property)
      }
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
          src={
            property.image ||
            "/images/default.png"
          }
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

            onBookmark(
              property.id,
            );
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

      <div className="flex min-h-[205px] flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm font-bold text-gray-12">
            {property.title}
          </span>

          <span className="shrink-0 rounded-full bg-primary-tint-1 px-2 py-1 text-xs text-primary">
            {property.type}
          </span>
        </div>

        <p className="text-sm text-gray-9">
          {property.area.toLocaleString(
            "fa-IR",
          )}{" "}
          متر، {property.location}
        </p>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-8">
          <span>
            {property.bedrooms.toLocaleString(
              "fa-IR",
            )}{" "}
            خواب
          </span>

          <span>•</span>

          <span>
            طبقه{" "}
            {property.floor.toLocaleString(
              "fa-IR",
            )}
          </span>

          <span>•</span>

          <span>
            ساخت{" "}
            {property.yearBuilt.toLocaleString(
              "fa-IR",
            )}
          </span>
        </div>

        <div className="mt-auto border-t border-gray-4 pt-3">
          <p className="text-base font-bold text-gray-13">
            ودیعه{" "}
            {formatPrice(
              property.deposit,
            )}
          </p>

          <p className="mt-1 text-xs text-gray-8">
            اجاره ماهانه{" "}
            {property.rent.toLocaleString(
              "fa-IR",
            )}{" "}
            میلیون تومان
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Rent() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [district, setDistrict] =
    useState("همه مناطق");

  const [
    propertyType,
    setPropertyType,
  ] = useState("همه انواع");

  const [
    deposit,
    setDeposit,
  ] = useState("همه ودیعه‌ها");

  const [rent, setRent] =
    useState("همه اجاره‌ها");

  const [area, setArea] =
    useState("همه متراژها");

  const [
    bedroom,
    setBedroom,
  ] = useState(
    "همه تعداد اتاق‌ها",
  );

  const [
    buildYear,
    setBuildYear,
  ] = useState("همه سال‌ها");

  const [sort, setSort] =
    useState("جدیدترین");

  const [
    showMoreFilters,
    setShowMoreFilters,
  ] = useState(false);

  const [
    bookmarked,
    setBookmarked,
  ] = useState<string[]>([]);

  const [
    selectedProperty,
    setSelectedProperty,
  ] = useState<Property | null>(
    null,
  );

  const [
    properties,
    setProperties,
  ] = useState<Property[]>(
    [],
  );

  const [
    totalProperties,
    setTotalProperties,
  ] = useState(0);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchProperties =
      async () => {
        try {
          setIsLoading(true);
          setHasError(false);

          const params =
            new URLSearchParams();

          params.set(
            "transactionType",
            "rent",
          );

          params.set(
            "page",
            "1",
          );

          /*
           * We fetch up to 50 records
           * because the existing Rent
           * page uses client-side map
           * and filtering behavior.
           */
          params.set(
            "limit",
            "50",
          );

          if (search.trim()) {
            params.set(
              "search",
              search.trim(),
            );
          }

          if (
            district !==
            "همه مناطق"
          ) {
            params.set(
              "district",
              district,
            );
          }

          if (
            propertyType !==
            "همه انواع"
          ) {
            params.set(
              "propertyType",
              propertyType,
            );
          }

          if (
            deposit !==
            "همه ودیعه‌ها"
          ) {
            params.set(
              "deposit",
              deposit,
            );
          }

          if (
            rent !==
            "همه اجاره‌ها"
          ) {
            params.set(
              "rent",
              rent,
            );
          }

          if (
            area !==
            "همه متراژها"
          ) {
            params.set(
              "area",
              area,
            );
          }

          if (
            bedroom !==
            "همه تعداد اتاق‌ها"
          ) {
            params.set(
              "bedroom",
              bedroom,
            );
          }

          if (
            buildYear !==
            "همه سال‌ها"
          ) {
            params.set(
              "buildYear",
              buildYear,
            );
          }

          params.set(
            "sort",
            sort,
          );

          const response =
            await fetch(
              `/api/properties?${params.toString()}`,
              {
                cache:
                  "no-store",
                signal:
                  controller.signal,
              },
            );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch properties",
            );
          }

          const data =
            await response.json();

          if (
            !data.success ||
            !Array.isArray(
              data.properties,
            )
          ) {
            throw new Error(
              "Invalid API response",
            );
          }

          setProperties(
            data.properties,
          );

          setTotalProperties(
            data.pagination
              ?.total ??
              data.properties
                .length,
          );
        } catch (error) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "Rent properties error:",
            error,
          );

          setProperties(
            [],
          );

          setTotalProperties(
            0,
          );

          setHasError(true);
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setIsLoading(
              false,
            );
          }
        }
      };

    fetchProperties();

    return () => {
      controller.abort();
    };
  }, [
    search,
    district,
    propertyType,
    deposit,
    rent,
    area,
    bedroom,
    buildYear,
    sort,
  ]);

  const clearFilters =
    () => {
      setSearch("");

      setDistrict(
        "همه مناطق",
      );

      setPropertyType(
        "همه انواع",
      );

      setDeposit(
        "همه ودیعه‌ها",
      );

      setRent(
        "همه اجاره‌ها",
      );

      setArea(
        "همه متراژها",
      );

      setBedroom(
        "همه تعداد اتاق‌ها",
      );

      setBuildYear(
        "همه سال‌ها",
      );

      setSort(
        "جدیدترین",
      );

      setSelectedProperty(
        null,
      );
    };

  const toggleBookmark = (
    id: string,
  ) => {
    setBookmarked(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id,
            )
          : [
              ...current,
              id,
            ],
    );
  };

  const handlePropertySelect =
    (property: Property) => {
      setSelectedProperty(
        property,
      );

      router.push(
        `/rent/${property.id}`,
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
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
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
              onChange={
                setDistrict
              }
            />

            <FilterDropdown
              value={propertyType}
              options={
                propertyTypes
              }
              onChange={
                setPropertyType
              }
            />

            <FilterDropdown
              value={deposit}
              options={deposits}
              onChange={
                setDeposit
              }
            />

            <FilterDropdown
              value={area}
              options={areas}
              onChange={setArea}
            />

            <button
              type="button"
              onClick={() =>
                setShowMoreFilters(
                  (current) =>
                    !current,
                )
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
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold text-gray-12">
                    فیلترهای بیشتر
                  </h3>

                  <p className="mt-1 text-sm text-gray-8">
                    ملک مناسب خود را با جزئیات بیشتری پیدا کنید.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <FilterDropdown
                  value={rent}
                  options={rents}
                  onChange={setRent}
                />

                <FilterDropdown
                  value={bedroom}
                  options={
                    bedrooms
                  }
                  onChange={
                    setBedroom
                  }
                />

                <FilterDropdown
                  value={buildYear}
                  options={
                    buildYears
                  }
                  onChange={
                    setBuildYear
                  }
                />
              </div>
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
                املاک برای اجاره
              </h1>

              <p className="mt-1 text-sm text-gray-8">
                {totalProperties.toLocaleString(
                  "fa-IR",
                )}{" "}
                مورد یافت شد
              </p>
            </div>

            <div className="relative w-full sm:w-[175px]">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value,
                  )
                }
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
                <option value="جدیدترین">
                  جدیدترین
                </option>

                <option value="ارزان‌ترین">
                  ارزان‌ترین
                </option>

                <option value="گران‌ترین">
                  گران‌ترین
                </option>

                <option value="متراژ بیشتر">
                  متراژ بیشتر
                </option>
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

          {isLoading ? (
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-gray-5
                bg-white
              "
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-4 border-t-primary" />

              <p className="mt-4 text-sm text-gray-8">
                در حال دریافت املاک...
              </p>
            </div>
          ) : hasError ? (
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
                دریافت املاک با مشکل مواجه شد
              </h3>

              <p className="mt-2 text-sm text-gray-8">
                اتصال به سرور را بررسی کنید و دوباره تلاش کنید.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
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
                تلاش مجدد
              </button>
            </div>
          ) : properties.length >
            0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {properties.map(
                (property) => (
                  <PropertyCard
                    key={
                      property.id
                    }
                    property={
                      property
                    }
                    bookmarked={bookmarked.includes(
                      property.id,
                    )}
                    onBookmark={
                      toggleBookmark
                    }
                    onSelect={
                      handlePropertySelect
                    }
                  />
                ),
              )}
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
                onClick={
                  clearFilters
                }
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
                properties={
                  properties
                }
                selectedProperty={
                  selectedProperty
                }
                onSelectProperty={
                  handlePropertySelect
                }
              />
            </div>

            {selectedProperty && (
              <div className="border-t border-gray-5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={
                        selectedProperty.image ||
                        "/images/default.png"
                      }
                      alt={
                        selectedProperty.title
                      }
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-12">
                      {
                        selectedProperty.title
                      }
                    </h3>

                    <p className="mt-1 text-xs text-gray-8">
                      {selectedProperty.area.toLocaleString(
                        "fa-IR",
                      )}{" "}
                      متر،{" "}
                      {
                        selectedProperty.location
                      }
                    </p>

                    <p className="mt-1 text-xs font-bold text-primary">
                      ودیعه{" "}
                      {formatPrice(
                        selectedProperty.deposit,
                      )}
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-11">
                      اجاره{" "}
                      {selectedProperty.rent.toLocaleString(
                        "fa-IR",
                      )}{" "}
                      میلیون تومان
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}