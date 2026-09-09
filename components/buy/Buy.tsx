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

import type { BuyProperty } from "@/data/buyProperties";

const BuyMap = dynamic(
  () => import("./BuyMap"),
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

const prices = [
  "همه قیمت‌ها",
  "زیر ۵ میلیارد",
  "۵ تا ۱۰ میلیارد",
  "۱۰ تا ۱۵ میلیارد",
  "بالای ۱۵ میلیارد",
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
        onChange={(event) =>
          onChange(event.target.value)
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
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
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
  property: BuyProperty;
  bookmarked: boolean;
  onBookmark: (
    id: string | number,
  ) => void;
  onSelect: (
    property: BuyProperty,
  ) => void;
};

function PropertyCard({
  property,
  bookmarked,
  onBookmark,
  onSelect,
}: PropertyCardProps) {
  const pricePerMeter =
    property.area > 0
      ? Math.round(
          property.price /
            property.area,
        )
      : 0;

  const propertyTypeLabel =
    property.type === "apartment"
      ? "آپارتمان"
      : property.type === "house"
        ? "خانه"
        : property.type === "villa"
          ? "ویلا"
          : property.type ===
              "commercial"
            ? "تجاری"
            : property.type ===
                "land"
              ? "زمین"
              : property.type;

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
          loading="eager"
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
            {propertyTypeLabel}
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
            {formatPrice(
              property.price,
            )}
          </p>

          <p className="mt-1 text-xs text-gray-8">
            متری{" "}
            {pricePerMeter.toLocaleString(
              "fa-IR",
            )}{" "}
            میلیون تومان
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Buy() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [district, setDistrict] =
    useState("همه مناطق");

  const [propertyType, setPropertyType] =
    useState("همه انواع");

  const [price, setPrice] =
    useState("همه قیمت‌ها");

  const [area, setArea] =
    useState("همه متراژها");

  const [bedroom, setBedroom] =
    useState("همه تعداد اتاق‌ها");

  const [buildYear, setBuildYear] =
    useState("همه سال‌ها");

  const [sort, setSort] =
    useState("جدیدترین");

  const [
    showMoreFilters,
    setShowMoreFilters,
  ] = useState(false);

  const [bookmarked, setBookmarked] =
    useState<
      (string | number)[]
    >([]);

  const [
    selectedProperty,
    setSelectedProperty,
  ] = useState<BuyProperty | null>(
    null,
  );

  const [properties, setProperties] =
    useState<BuyProperty[]>([]);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [
    totalProperties,
    setTotalProperties,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const limit = 10;

  /*
   * وقتی هر کدام از فیلترها تغییر کند،
   * دوباره از صفحه اول API دریافت می‌کنیم.
   */
  useEffect(() => {
    setPage(1);
  }, [
    search,
    district,
    propertyType,
    price,
    area,
    bedroom,
    buildYear,
    sort,
  ]);

  /*
   * دریافت آگهی‌ها از API
   */
  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      setLoading(true);

      try {
        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(page),
        );

        params.set(
          "limit",
          String(limit),
        );

        params.set(
          "search",
          search,
        );

        params.set(
          "district",
          district,
        );

        params.set(
          "propertyType",
          propertyType,
        );

        params.set(
          "price",
          price,
        );

        params.set(
          "area",
          area,
        );

        params.set(
          "bedroom",
          bedroom,
        );

        params.set(
          "buildYear",
          buildYear,
        );

        params.set(
          "sort",
          sort,
        );

        const response =
          await fetch(
            `/api/properties?${params.toString()}`,
            {
              cache: "no-store",
            },
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "دریافت آگهی‌ها ناموفق بود.",
          );
        }

        if (cancelled) {
          return;
        }

        setProperties(
          data.properties || [],
        );

        setTotalProperties(
          data.pagination
            ?.total ?? 0,
        );

        setTotalPages(
          data.pagination
            ?.totalPages || 1,
        );
      } catch (error) {
        console.error(
          "Buy properties fetch error:",
          error,
        );

        if (!cancelled) {
          setProperties([]);
          setTotalProperties(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    district,
    propertyType,
    price,
    area,
    bedroom,
    buildYear,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setDistrict(
      "همه مناطق",
    );
    setPropertyType(
      "همه انواع",
    );
    setPrice(
      "همه قیمت‌ها",
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
    setPage(1);
    setSelectedProperty(null);
  };

  const toggleBookmark = (
    id: string | number,
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

  const handlePropertySelect = (
    property: BuyProperty,
  ) => {
    setSelectedProperty(
      property,
    );

    router.push(
      `/buy/${property.id}`,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          Filters
      ========================== */}

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
          {/* Search */}

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

          {/* Main filters */}

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

        {/* More filters */}

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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
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

      {/* =========================
          Main content
      ========================== */}

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
        {/* =========================
            Properties
        ========================== */}

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-13">
                املاک برای فروش
              </h1>

              <p className="mt-1 text-sm text-gray-8">
                {totalProperties.toLocaleString(
                  "fa-IR",
                )}{" "}
                مورد یافت شد
              </p>
            </div>

            {/* Sort */}

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

                <option value="متراژ کمتر">
                  متراژ کمتر
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

          {/* Loading */}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({
                length: 10,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="
                      h-[370px]
                      animate-pulse
                      rounded-lg
                      bg-gray-3
                    "
                  />
                ),
              )}
            </div>
          ) : properties.length >
            0 ? (
            <>
              {/* Property cards */}

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

              {/* Pagination */}

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        page === 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              current -
                                1,
                              1,
                            ),
                        )
                      }
                      className="
                        rounded-md
                        border
                        border-gray-5
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-gray-11
                        transition
                        hover:border-primary
                        hover:text-primary
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      قبلی
                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1,
                    )
                      .filter(
                        (
                          pageNumber,
                        ) => {
                          if (
                            totalPages <=
                            5
                          ) {
                            return true;
                          }

                          return (
                            pageNumber ===
                              1 ||
                            pageNumber ===
                              totalPages ||
                            Math.abs(
                              pageNumber -
                                page,
                            ) <= 1
                          );
                        },
                      )
                      .map(
                        (
                          pageNumber,
                        ) => (
                          <button
                            key={
                              pageNumber
                            }
                            type="button"
                            onClick={() =>
                              setPage(
                                pageNumber,
                              )
                            }
                            className={`
                              flex
                              h-10
                              min-w-10
                              items-center
                              justify-center
                              rounded-md
                              border
                              px-3
                              text-sm
                              font-bold
                              transition
                              ${
                                page ===
                                pageNumber
                                  ? "border-primary bg-primary text-white"
                                  : "border-gray-5 bg-white text-gray-11 hover:border-primary hover:text-primary"
                              }
                            `}
                          >
                            {pageNumber.toLocaleString(
                              "fa-IR",
                            )}
                          </button>
                        ),
                      )}

                    <button
                      type="button"
                      disabled={
                        page ===
                        totalPages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.min(
                              current +
                                1,
                              totalPages,
                            ),
                        )
                      }
                      className="
                        rounded-md
                        border
                        border-gray-5
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-gray-11
                        transition
                        hover:border-primary
                        hover:text-primary
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      بعدی
                    </button>
                  </div>

                  <p className="text-xs text-gray-8">
                    صفحه{" "}
                    {page.toLocaleString(
                      "fa-IR",
                    )}{" "}
                    از{" "}
                    {totalPages.toLocaleString(
                      "fa-IR",
                    )}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Empty state */

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

        {/* =========================
            Map
        ========================== */}

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
              <BuyMap
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

            {/* Selected property */}

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
                      {
                        formatPrice(
                          selectedProperty.price,
                        )
                      }
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-11">
                      متری{" "}
                      {(
                        selectedProperty.area >
                        0
                          ? Math.round(
                              selectedProperty.price /
                                selectedProperty.area,
                            )
                          : 0
                      ).toLocaleString(
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