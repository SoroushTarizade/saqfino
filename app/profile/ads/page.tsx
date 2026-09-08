"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiHome,
  FiPlus,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

type PropertyStatus =
  | "pending"
  | "active"
  | "rejected";

type Property = {
  id: string;
  title: string;
  transactionType:
    | "buy"
    | "rent"
    | "mortgage";
  propertyType:
    | "apartment"
    | "villa"
    | "office"
    | "commercial"
    | "land";
  price: number | null;
  rent: number | null;
  deposit: number | null;
  area: number;
  rooms: number;
  city: string;
  district: string;
  address: string;
  description: string;
  images: string[];
  amenities: string[];
  status: PropertyStatus;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
};

function formatPrice(
  value: number | null,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "fa-IR",
  ).format(value);
}

function getTransactionLabel(
  type: Property["transactionType"],
) {
  switch (type) {
    case "buy":
      return "فروش";

    case "rent":
      return "رهن و اجاره";

    case "mortgage":
      return "رهن";

    default:
      return "—";
  }
}

function getPropertyTypeLabel(
  type: Property["propertyType"],
) {
  switch (type) {
    case "apartment":
      return "آپارتمان";

    case "villa":
      return "ویلا";

    case "office":
      return "دفتر کار";

    case "commercial":
      return "تجاری";

    case "land":
      return "زمین";

    default:
      return "ملک";
  }
}

function getStatusInfo(
  status: PropertyStatus,
) {
  switch (status) {
    case "active":
      return {
        label: "فعال",
        className:
          "bg-green-100 text-green-700",
      };

    case "rejected":
      return {
        label: "رد شده",
        className:
          "bg-red-100 text-red-700",
      };

    case "pending":
    default:
      return {
        label: "در انتظار بررسی",
        className:
          "bg-yellow-100 text-yellow-700",
      };
  }
}

function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ).format(new Date(date));
}

export default function MyAdsPage() {
  const [properties, setProperties] =
    useState<Property[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProperties =
      async () => {
        try {
          const response =
            await fetch(
              "/api/properties/my",
              {
                method: "GET",
                cache: "no-store",
              },
            );

          const data =
            await response.json();

          if (response.status === 401) {
            window.location.href =
              "/login";

            return;
          }

          if (!response.ok) {
            setError(
              data.message ||
                "دریافت آگهی‌ها با خطا مواجه شد.",
            );

            return;
          }

          setProperties(
            data.properties || [],
          );
        } catch (error) {
          console.error(
            "My ads loading error:",
            error,
          );

          setError(
            "خطایی هنگام دریافت آگهی‌ها رخ داد.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    loadProperties();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-16 pt-[96px] lg:pt-10">
        <div className="mx-auto w-full max-w-[1224px] px-4 md:px-6">
          <div className="mx-auto max-w-[1000px]">
            {/* Page Header */}
            <div className="mb-8">
              <Link
                href="/profile"
                className="mb-5 flex w-fit items-center gap-2 text-sm font-bold text-gray-7 transition-colors hover:text-[#CB1B1B]"
              >
                <FiArrowRight size={17} />

                <span>
                  بازگشت به پروفایل
                </span>
              </Link>

              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-10 md:text-3xl">
                    آگهی‌های من
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-gray-7 md:text-base">
                    آگهی‌های ثبت‌شده توسط شما را مشاهده و مدیریت کنید.
                  </p>
                </div>

                <Link
                  href="/submit"
                  className="
                    flex
                    h-11
                    w-fit
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#CB1B1B]
                    px-5
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#A91515]
                  "
                >
                  <FiPlus size={19} />

                  <span>
                    ثبت آگهی جدید
                  </span>
                </Link>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="animate-pulse overflow-hidden rounded-2xl border border-gray-4"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="h-52 bg-gray-3 md:h-auto md:w-64" />

                        <div className="flex-1 p-5">
                          <div className="h-5 w-48 rounded bg-gray-3" />

                          <div className="mt-4 h-4 w-32 rounded bg-gray-3" />

                          <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="h-12 rounded bg-gray-3" />
                            <div className="h-12 rounded bg-gray-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Error */}
            {!isLoading &&
              error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                  <p className="text-sm font-bold text-red-700">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      window.location.reload()
                    }
                    className="mt-4 rounded-lg bg-[#CB1B1B] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#A91515]"
                  >
                    تلاش مجدد
                  </button>
                </div>
              )}

            {/* Empty State */}
            {!isLoading &&
              !error &&
              properties.length ===
                0 && (
                <div className="rounded-2xl border border-gray-4 px-6 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF2F2] text-[#CB1B1B]">
                    <FiHome size={28} />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-gray-10">
                    هنوز آگهی‌ای ثبت نکرده‌اید
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-7">
                    اگر ملکی برای فروش، اجاره یا رهن دارید، می‌توانید اولین آگهی خود را در سقفینو ثبت کنید.
                  </p>

                  <Link
                    href="/submit"
                    className="
                      mx-auto
                      mt-6
                      flex
                      h-11
                      w-fit
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#CB1B1B]
                      px-5
                      text-sm
                      font-bold
                      text-white
                      transition-colors
                      hover:bg-[#A91515]
                    "
                  >
                    <FiPlus size={19} />

                    <span>
                      ثبت اولین آگهی
                    </span>
                  </Link>
                </div>
              )}

            {/* Properties */}
            {!isLoading &&
              !error &&
              properties.length >
                0 && (
                <div className="space-y-4">
                  {properties.map(
                    (property) => {
                      const status =
                        getStatusInfo(
                          property.status,
                        );

                      const image =
                        property.images?.[0];

                      return (
                        <article
                          key={
                            property.id
                          }
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-4
                            bg-white
                            transition-all
                            duration-200
                            hover:border-gray-5
                            hover:shadow-md
                          "
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="relative h-56 w-full shrink-0 bg-gray-3 md:h-auto md:min-h-[240px] md:w-64">
                              {image ? (
                                <Image
                                  src={
                                    image
                                  }
                                  alt={
                                    property.title
                                  }
                                  fill
                                  sizes="256px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-6">
                                  <FiHome
                                    size={
                                      40
                                    }
                                  />
                                </div>
                              )}

                              <div className="absolute right-3 top-3">
                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                                >
                                  {
                                    status.label
                                  }
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-md bg-[#FEF2F2] px-2.5 py-1 text-xs font-bold text-[#CB1B1B]">
                                      {getTransactionLabel(
                                        property.transactionType,
                                      )}
                                    </span>

                                    <span className="text-xs text-gray-6">
                                      {getPropertyTypeLabel(
                                        property.propertyType,
                                      )}
                                    </span>
                                  </div>

                                  <h2 className="mt-3 truncate text-lg font-bold text-gray-10">
                                    {
                                      property.title
                                    }
                                  </h2>

                                  <p className="mt-2 truncate text-sm text-gray-7">
                                    {property.city}
                                    {"، "}
                                    {
                                      property.district
                                    }
                                  </p>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div className="rounded-lg bg-gray-3 px-3 py-3">
                                  <p className="text-xs text-gray-6">
                                    متراژ
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-gray-10">
                                    {new Intl.NumberFormat(
                                      "fa-IR",
                                    ).format(
                                      property.area,
                                    )}{" "}
                                    متر
                                  </p>
                                </div>

                                <div className="rounded-lg bg-gray-3 px-3 py-3">
                                  <p className="text-xs text-gray-6">
                                    اتاق
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-gray-10">
                                    {new Intl.NumberFormat(
                                      "fa-IR",
                                    ).format(
                                      property.rooms,
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-lg bg-gray-3 px-3 py-3">
                                  <p className="text-xs text-gray-6">
                                    قیمت
                                  </p>

                                  <p className="mt-1 truncate text-sm font-bold text-gray-10">
                                    {property.transactionType ===
                                    "buy"
                                      ? formatPrice(
                                          property.price,
                                        )
                                      : formatPrice(
                                          property.deposit,
                                        )}
                                  </p>
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="mt-5 flex flex-col gap-4 border-t border-gray-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-6">
                                  <FiCalendar
                                    size={
                                      15
                                    }
                                  />

                                  <span>
                                    ثبت‌شده در{" "}
                                    {formatDate(
                                      property.createdAt,
                                    )}
                                  </span>
                                </div>

                                {property.status ===
                                  "rejected" &&
                                  property.rejectionReason && (
                                    <p className="text-xs font-bold text-red-600">
                                      دلیل رد:{" "}
                                      {
                                        property.rejectionReason
                                      }
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}