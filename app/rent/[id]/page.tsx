import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookmark,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiHome,
  FiMapPin,
  FiMaximize,
  FiPhone,
  FiShare2,
  FiStar,
  FiTool,
  FiUser,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { properties } from "@/data/properties";

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  const property = properties.find(
    (item) => item.id === Number(id),
  );

  if (!property) {
    return (
      <>
        <Header />

        <main className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-12">
              ملک مورد نظر پیدا نشد
            </h1>

            <p className="mt-3 text-sm text-gray-8">
              ممکن است آگهی حذف شده باشد یا آدرس وارد شده صحیح نباشد.
            </p>

            <Link
              href="/rent"
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

  const relatedProperties = properties
    .filter((item) => item.id !== property.id)
    .filter(
      (item) =>
        item.district === property.district ||
        item.type === property.type,
    )
    .slice(0, 3);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
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
            lg:pt-8
          "
        >
          <Link
            href="/rent"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-gray-9
              transition
              hover:text-primary
            "
          >
            <FiArrowRight className="h-4 w-4" />
            بازگشت به املاک اجاره‌ای
          </Link>
        </section>

        {/* Gallery */}
        <section className="mx-auto w-full max-w-[1224px] px-4 md:px-6 lg:px-0">
          <div className="grid h-[420px] grid-cols-1 gap-3 overflow-hidden rounded-xl md:grid-cols-4">
            <div className="relative overflow-hidden md:col-span-2 md:row-span-2">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />

              <div className="absolute bottom-4 right-4 rounded-md bg-black/60 px-3 py-2 text-xs font-bold text-white">
                {property.type}
              </div>
            </div>

            {property.images.slice(1, 5).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative hidden overflow-hidden md:block"
              >
                <Image
                  src={image}
                  alt={`${property.title} - تصویر ${index + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />

                {index === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <span className="rounded-md bg-white/90 px-4 py-2 text-sm font-bold text-gray-12">
                      مشاهده تصاویر
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main */}
        <section
          className="
            mx-auto
            grid
            w-full
            max-w-[1224px]
            gap-8
            px-4
            py-8
            md:px-6
            lg:grid-cols-[1fr_360px]
            lg:px-0
          "
        >
          {/* Main content */}
          <div className="min-w-0">
            {/* Title */}
            <div className="border-b border-gray-5 pb-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-8">
                    <FiMapPin className="h-4 w-4 text-primary" />
                    <span>{property.location}</span>
                  </div>

                  <h1 className="text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
                    {property.title}
                  </h1>

                  <p className="mt-2 text-sm text-gray-8">
                    {property.district}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="اشتراک‌گذاری"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-gray-5
                      text-gray-9
                      transition
                      hover:border-primary
                      hover:text-primary
                    "
                  >
                    <FiShare2 className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="ذخیره آگهی"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-gray-5
                      text-gray-9
                      transition
                      hover:border-primary
                      hover:text-primary
                    "
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 border-b border-gray-5 py-6 sm:grid-cols-4">
              <InfoItem
                icon={<FiMaximize />}
                label="متراژ"
                value={`${property.area.toLocaleString("fa-IR")} متر`}
              />

              <InfoItem
                icon={<FiHome />}
                label="اتاق خواب"
                value={`${property.bedrooms.toLocaleString("fa-IR")} خواب`}
              />

              <InfoItem
                icon={<FiTool />}
                label="طبقه"
                value={`${property.floor.toLocaleString("fa-IR")} از ${property.totalFloors.toLocaleString("fa-IR")}`}
              />

              <InfoItem
                icon={<FiCalendar />}
                label="سال ساخت"
                value={property.yearBuilt.toLocaleString("fa-IR")}
              />
            </div>

            {/* Price */}
            <div className="border-b border-gray-5 py-6">
              <h2 className="mb-5 text-xl font-bold text-gray-12">
                اطلاعات مالی
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <PriceBox
                  title="رهن"
                  value={property.deposit}
                />

                <PriceBox
                  title="اجاره ماهانه"
                  value={property.rent}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-5 py-6">
              <h2 className="mb-5 text-xl font-bold text-gray-12">
                امکانات ملک
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-md
                      bg-gray-3
                      px-4
                      py-3
                      text-sm
                      text-gray-11
                    "
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-tint-1 text-primary">
                      <FiCheck className="h-4 w-4" />
                    </span>

                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-5 py-6">
              <h2 className="mb-5 text-xl font-bold text-gray-12">
                توضیحات
              </h2>

              <p className="text-sm leading-8 text-gray-9">
                {property.description}
              </p>
            </div>

            {/* Location */}
            <div className="py-6">
              <h2 className="mb-5 text-xl font-bold text-gray-12">
                موقعیت ملک
              </h2>

              <div className="relative h-[350px] overflow-hidden rounded-xl border border-gray-5 bg-gray-3">
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <FiMapPin className="mx-auto mb-3 h-10 w-10 text-primary" />

                    <p className="font-bold text-gray-12">
                      {property.location}
                    </p>

                    <p className="mt-2 text-sm text-gray-8">
                      موقعیت ملک روی نقشه
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="lg:sticky lg:top-6">
              {/* Agency */}
              <div className="rounded-xl border border-gray-5 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src="/images/default.png"
                      alt="مشاور املاک"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-8">
                      ارائه‌دهنده آگهی
                    </p>

                    <h3 className="mt-1 font-bold text-gray-12">
                      مشاور املاک البرز
                    </h3>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between rounded-md bg-gray-3 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-9">
                    <FiStar className="fill-yellow-400 text-yellow-400" />
                    رضایت کاربران
                  </div>

                  <span className="font-bold text-gray-12">
                    ۴ از ۵
                  </span>
                </div>

                <button
                  type="button"
                  className="
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-primary
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-primary-shade-1
                    active:scale-[0.98]
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
                    rounded-md
                    border
                    border-primary
                    text-sm
                    font-bold
                    text-primary
                    transition
                    hover:bg-primary-tint-1
                  "
                >
                  <FiUser className="h-5 w-5" />
                  مشاهده دفتر املاک
                </button>
              </div>

              {/* Price summary */}
              <div className="mt-4 rounded-xl border border-gray-5 bg-gray-3 p-5">
                <h3 className="font-bold text-gray-12">
                  خلاصه هزینه
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-8">
                      رهن
                    </span>

                    <span className="font-bold text-gray-12">
                      {property.deposit.toLocaleString("fa-IR")} میلیون
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-8">
                      اجاره
                    </span>

                    <span className="font-bold text-gray-12">
                      {property.rent.toLocaleString("fa-IR")} میلیون
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Related properties */}
        {relatedProperties.length > 0 && (
          <section className="mx-auto mb-16 w-full max-w-[1224px] px-4 md:px-6 lg:px-0">
            <div className="border-t border-gray-5 pt-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-1.5 rounded-full bg-primary" />

                  <h2 className="text-xl font-bold text-gray-12 md:text-2xl">
                    ملک‌های مشابه
                  </h2>
                </div>

                <Link
                  href="/rent"
                  className="
                    hidden
                    items-center
                    gap-1
                    text-sm
                    font-bold
                    text-primary
                    sm:flex
                  "
                >
                  مشاهده همه
                  <FiChevronLeft />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProperties.map((item) => (
                  <Link
                    key={item.id}
                    href={`/rent/${item.id}`}
                    className="
                      group
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-5
                      bg-white
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary/30
                      hover:shadow-lg
                    "
                  >
                    <div className="relative h-[190px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-12">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-8">
                        {item.area.toLocaleString("fa-IR")} متر،{" "}
                        {item.location}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-gray-8">
                          رهن
                        </span>

                        <span className="font-bold text-gray-12">
                          {item.deposit.toLocaleString("fa-IR")} میلیون
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-8">
                          اجاره
                        </span>

                        <span className="font-bold text-primary">
                          {item.rent.toLocaleString("fa-IR")} میلیون
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-tint-1 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-8">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-gray-12">
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceBox({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-gray-5 bg-gray-3 p-4">
      <p className="text-sm text-gray-8">
        {title}
      </p>

      <p className="mt-2 text-lg font-bold text-gray-12">
        {value.toLocaleString("fa-IR")}{" "}
        <span className="text-xs font-normal text-gray-8">
          میلیون تومان
        </span>
      </p>
    </div>
  );
}