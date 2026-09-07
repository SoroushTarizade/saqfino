"use client";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
FiArrowRight,
FiBookmark,
FiCheck,
FiMapPin,
FiPhone,
FiShare2,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import {
buyProperties,
type BuyProperty,
} from "@/data/buyProperties";
import {
getSubmittedBuyProperties,
} from "@/lib/submittedProperties";

type PageProps = {
params: Promise<{
id: string;
}>;
};

export default function BuyDetailPage({
params,
}: PageProps) {
const { id } = use(params);

const [property, setProperty] =
useState<BuyProperty | null>(null);

const [isLoading, setIsLoading] =
useState(true);

useEffect(() => {
const propertyId = Number(id);


if (Number.isNaN(propertyId)) {
  setProperty(null);
  setIsLoading(false);
  return;
}

/*
 * اول آگهی‌های فروش ثبت‌شده توسط کاربر
 * و سپس آگهی‌های پیش‌فرض پروژه بررسی می‌شوند.
 */
const submittedProperties =
  getSubmittedBuyProperties();

const submittedProperty =
  submittedProperties.find(
    (item) => item.id === propertyId,
  );

if (submittedProperty) {
  const normalizedProperty: BuyProperty = {
    id: submittedProperty.id,

    image:
      submittedProperty.image ||
      "/images/default.png",

    images:
      submittedProperty.images.length > 0
        ? submittedProperty.images
        : [
            submittedProperty.image ||
              "/images/default.png",
          ],

    title: submittedProperty.title,

    location: `${submittedProperty.city}، ${submittedProperty.district}`,

    district: submittedProperty.district,

    price:
      submittedProperty.salePrice /
      1_000_000,

    area: submittedProperty.area,

    bedrooms:
      submittedProperty.bedrooms,

    floor: submittedProperty.floor,

    totalFloors:
      submittedProperty.totalFloors,

    yearBuilt:
      submittedProperty.yearBuilt,

    type:
      submittedProperty.propertyType,

    amenities:
      submittedProperty.amenities,

    description:
      submittedProperty.description,

    lat:
      submittedProperty.latitude,

    lng:
      submittedProperty.longitude,

    createdAt:
      submittedProperty.createdAt,
  };

  setProperty(normalizedProperty);
  setIsLoading(false);
  return;
}

const staticProperty =
  buyProperties.find(
    (item) => item.id === propertyId,
  );

setProperty(staticProperty ?? null);
setIsLoading(false);


}, [id]);

if (isLoading) {
return (
<> <Header />


    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-4 border-t-primary" />

        <p className="mt-4 text-sm text-gray-8">
          در حال بارگذاری آگهی...
        </p>
      </div>
    </main>

    <Footer />
  </>
);


}

if (!property) {
return (
<> <Header />


    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-12">
          ملک مورد نظر پیدا نشد
        </h1>

        <p className="mt-3 text-sm text-gray-8">
          ممکن است آگهی حذف شده باشد یا آدرس وارد شده صحیح نباشد.
        </p>

        <Link
          href="/buy"
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-primary
            px-6
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-primary-shade-1
          "
        >
          <FiArrowRight className="h-4 w-4" />
          بازگشت به املاک
        </Link>
      </div>
    </main>

    <Footer />
  </>
);


}

const pricePerMeter = Math.round(
property.price / property.area,
);

const relatedProperties = buyProperties
.filter(
(item) => item.id !== property.id,
)
.filter(
(item) =>
item.district === property.district ||
item.type === property.type,
)
.slice(0, 3);

return (
<> <Header />


  <main
    dir="rtl"
    className="min-h-screen bg-white"
  >
    {/* Breadcrumb */}

    <section className="mx-auto w-full max-w-[1224px] px-4 pt-24 md:px-6 lg:px-0 lg:pt-8">
      <div className="flex items-center gap-2 text-sm text-gray-8">
        <Link
          href="/"
          className="transition hover:text-primary"
        >
          صفحه اصلی
        </Link>

        <FiArrowRight className="h-4 w-4" />

        <Link
          href="/buy"
          className="transition hover:text-primary"
        >
          خرید ملک
        </Link>

        <FiArrowRight className="h-4 w-4" />

        <span className="truncate text-gray-11">
          {property.title}
        </span>
      </div>
    </section>

    {/* Gallery */}

    <section className="mx-auto mt-6 w-full max-w-[1224px] px-4 md:px-6 lg:px-0">
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        {/* Main Image */}

        <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[400px] lg:h-[500px]">
          <Image
            src={
              property.images[0] ??
              property.image ??
              "/images/default.png"
            }
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />

          <div className="absolute left-4 top-4 flex gap-2">
            <button
              type="button"
              aria-label="ذخیره ملک"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-gray-11
                shadow-md
                transition
                hover:text-primary
              "
            >
              <FiBookmark className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="اشتراک‌گذاری"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-gray-11
                shadow-md
                transition
                hover:text-primary
              "
            >
              <FiShare2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Secondary Images */}

        <div className="grid grid-cols-2 gap-3">
          {property.images
            .slice(1, 5)
            .map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative min-h-[145px] overflow-hidden rounded-xl sm:min-h-[190px] lg:min-h-0"
              >
                <Image
                  src={
                    image ||
                    "/images/default.png"
                  }
                  alt={`${property.title} - تصویر ${
                    index + 2
                  }`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
        </div>
      </div>
    </section>

    {/* Main Content */}

    <section className="mx-auto mt-8 grid w-full max-w-[1224px] gap-8 px-4 pb-16 md:px-6 lg:grid-cols-[1fr_360px] lg:px-0">
      {/* Content */}

      <div>
        {/* Title */}

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary-tint-1 px-3 py-1.5 text-xs font-bold text-primary">
              {property.type}
            </span>

            <span className="text-sm text-gray-8">
              کد ملک:{" "}
              {property.id.toLocaleString(
                "fa-IR",
              )}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
            {property.title}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-9">
            <FiMapPin className="h-5 w-5 shrink-0 text-primary" />

            <span>
              {property.location}
            </span>

            <span>•</span>

            <span>
              {property.district}
            </span>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <InfoCard
            title="متراژ"
            value={`${property.area.toLocaleString(
              "fa-IR",
            )} متر`}
          />

          <InfoCard
            title="اتاق خواب"
            value={`${property.bedrooms.toLocaleString(
              "fa-IR",
            )} خواب`}
          />

          <InfoCard
            title="طبقه"
            value={`${property.floor.toLocaleString(
              "fa-IR",
            )} از ${property.totalFloors.toLocaleString(
              "fa-IR",
            )}`}
          />

          <InfoCard
            title="سال ساخت"
            value={property.yearBuilt.toLocaleString(
              "fa-IR",
            )}
          />
        </div>

        {/* Description */}

        <section className="mt-10 border-t border-gray-5 pt-8">
          <h2 className="text-xl font-bold text-gray-13">
            درباره این ملک
          </h2>

          <p className="mt-4 leading-8 text-gray-9">
            {property.description}
          </p>
        </section>

        {/* Amenities */}

        <section className="mt-10 border-t border-gray-5 pt-8">
          <h2 className="text-xl font-bold text-gray-13">
            امکانات ملک
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {property.amenities.map(
              (amenity) => (
                <div
                  key={amenity}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-gray-5
                    px-4
                    py-3
                    text-sm
                    text-gray-10
                  "
                >
                  <FiCheck className="h-4 w-4 shrink-0 text-primary" />

                  <span>{amenity}</span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Location */}

        <section className="mt-10 border-t border-gray-5 pt-8">
          <h2 className="text-xl font-bold text-gray-13">
            موقعیت ملک
          </h2>

          <div className="mt-5 flex h-[300px] items-center justify-center overflow-hidden rounded-xl border border-gray-5 bg-gray-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint-1">
                <FiMapPin className="h-7 w-7 text-primary" />
              </div>

              <p className="mt-4 font-bold text-gray-12">
                {property.location}
              </p>

              <p className="mt-2 text-sm text-gray-8">
                {property.district}
              </p>
            </div>
          </div>
        </section>

        {/* Related Properties */}

        {relatedProperties.length > 0 && (
          <section className="mt-10 border-t border-gray-5 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-13">
                املاک مشابه
              </h2>

              <Link
                href="/buy"
                className="text-sm font-bold text-primary transition hover:opacity-70"
              >
                مشاهده همه
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map(
                (item) => (
                  <Link
                    key={item.id}
                    href={`/buy/${item.id}`}
                    className="
                      group
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-5
                      bg-white
                      transition
                      hover:-translate-y-1
                      hover:border-primary/30
                      hover:shadow-lg
                    "
                  >
                    <div className="relative h-[160px] overflow-hidden">
                      <Image
                        src={
                          item.image ||
                          "/images/default.png"
                        }
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="truncate text-sm font-bold text-gray-12">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs text-gray-8">
                        {item.area.toLocaleString(
                          "fa-IR",
                        )}{" "}
                        متر • {item.location}
                      </p>

                      <p className="mt-3 text-sm font-bold text-primary">
                        {item.price.toLocaleString(
                          "fa-IR",
                        )}{" "}
                        میلیون تومان
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </section>
        )}
      </div>

      {/* Price / Contact Card */}

      <aside className="h-fit lg:sticky lg:top-6">
        <div className="rounded-xl border border-gray-5 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-8">
            قیمت کل
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-13">
{formatPrice(property.price)}{" "}
            میلیون تومان
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-gray-5 pt-4">
            <span className="text-sm text-gray-8">
              قیمت هر متر
            </span>

            <span className="text-sm font-bold text-gray-11">
              {pricePerMeter.toLocaleString(
                "fa-IR",
              )}{" "}
              میلیون
            </span>
          </div>

          <div className="mt-5 rounded-lg bg-gray-3 p-4">
            <p className="text-sm text-gray-8">
              موقعیت
            </p>

            <p className="mt-1 text-sm font-bold text-gray-12">
              {property.district}
            </p>
          </div>

          <button
            type="button"
            className="
              mt-5
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-primary
              font-bold
              text-white
              transition
              hover:bg-primary-shade-1
            "
          >
            <FiPhone className="h-5 w-5" />
            تماس با مشاور
          </button>

          <button
            type="button"
            className="
              mt-3
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-gray-5
              font-bold
              text-gray-11
              transition
              hover:border-primary
              hover:text-primary
            "
          >
            درخواست بازدید
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-gray-8">
            برای دریافت اطلاعات بیشتر و هماهنگی بازدید
            با مشاور ملک تماس بگیرید.
          </p>
        </div>
      </aside>
    </section>
  </main>

  <Footer />
</>


);
}

function InfoCard({
title,
value,
}: {
title: string;
value: string;
}) {
return ( <div className="rounded-lg bg-gray-3 p-4"> <p className="text-xs text-gray-8">
{title} </p>


  <p className="mt-2 font-bold text-gray-12">
    {value}
  </p>
</div>


);
}
