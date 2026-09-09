"use client";

import Image from "next/image";
import Link from "next/link";
import {
FiArrowLeft,
FiCheckCircle,
FiHome,
FiSearch,
FiShield,
FiUsers,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const values = [
{
icon: FiSearch,
title: "جست‌وجوی ساده",
description:
"کمک می‌کنیم ملک موردنظرتان را راحت‌تر پیدا کنید؛ بدون جست‌وجوهای پیچیده و سردرگم‌کننده.",
},
{
icon: FiShield,
title: "اعتماد و شفافیت",
description:
"اطلاعات ملک را شفاف‌تر ارائه می‌کنیم تا مسیر تصمیم‌گیری برای خرید یا اجاره مطمئن‌تر باشد.",
},
{
icon: FiUsers,
title: "ارتباط آسان",
description:
"سقفینو خریداران، مستأجران و فعالان بازار املاک را در یک فضای ساده به هم نزدیک می‌کند.",
},
{
icon: FiHome,
title: "تجربه بهتر خانه",
description:
"هدف ما فقط پیدا کردن یک ملک نیست؛ می‌خواهیم تجربه پیدا کردن خانه ساده‌تر و دلنشین‌تر باشد.",
},
];

const features = [
"جست‌وجو و بررسی آگهی‌های خرید و اجاره",
"فیلتر کردن املاک بر اساس نیاز و بودجه",
"مشاهده جزئیات و موقعیت مکانی ملک",
"ثبت آگهی برای مالکان و کاربران",
];

export default function AboutPage() {
return (
<> <Header />


  <main dir="rtl" className="min-h-screen bg-white text-gray-13">
    {/* Hero */}
    <section className="border-b border-gray-3 bg-gray-1">
      <div className="mx-auto grid w-full max-w-[1224px] items-center gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-0 lg:py-24">
        {/* Content */}
        <div className="max-w-[600px]">
          <span className="inline-flex rounded-full bg-[#CB1B1B]/10 px-4 py-2 text-[11px] font-bold text-[#CB1B1B] md:text-[12px] mt-8 lg:mt-0">
            درباره سقفینو
          </span>

          <h1 className="mt-5 text-2xl font-bold leading-[1.8] text-gray-13 sm:text-3xl md:text-4xl">
            سقفی برای یک
            <span className="text-[#CB1B1B]"> زندگی ایده‌آل</span>
          </h1>

          <p className="mt-5 max-w-[560px] text-justify text-sm leading-8 text-gray-8 md:text-[15px] md:leading-9">
            سقفینو یک پلتفرم برای جست‌وجو، خرید و اجاره ملک است؛ جایی که
            تلاش می‌کنیم مسیر پیدا کردن خانه یا ملک مناسب را ساده‌تر،
            شفاف‌تر و قابل‌اعتمادتر کنیم.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/buy"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#CB1B1B]
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#b81717]
              "
            >
              جست‌وجوی ملک
              <FiArrowLeft size={17} />
            </Link>

            <Link
              href="/submit"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-4
                bg-white
                px-6
                py-3.5
                text-sm
                font-bold
                text-gray-11
                transition-all
                duration-300
                hover:border-gray-6
                hover:bg-gray-1
              "
            >
              ثبت آگهی
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[500px]">
          <div className="relative overflow-hidden rounded-[24px] bg-white p-3 shadow-sm">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-gray-2">
              <Image
                src="/images/footer.svg"
                alt="سقفینو"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-contain p-8"
              />
            </div>
          </div>

          <div className="absolute -bottom-4 right-5 rounded-2xl border border-gray-3 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CB1B1B]/10 text-[#CB1B1B]">
                <FiHome size={16} />
              </span>

              <span className="text-xs font-bold text-gray-10">
                خانه‌ای که دنبالش هستید
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-[1224px] gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-0">
        <div>
          <span className="text-xs font-bold text-[#CB1B1B]">
            داستان سقفینو
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
            وقتی پیدا کردن خانه،
            <br />
            نباید سخت باشد
          </h2>
        </div>

        <div className="space-y-5 text-justify text-sm leading-8 text-gray-8 md:text-[15px] md:leading-9">
          <p>
            پیدا کردن خانه یکی از تصمیم‌های مهم زندگی است؛ اما فرآیند
            جست‌وجو همیشه ساده نیست. تعداد زیاد آگهی‌ها، تفاوت قیمت‌ها،
            موقعیت مکانی و جزئیات مختلف می‌توانند انتخاب را دشوار کنند.
          </p>

          <p>
            سقفینو با همین نگاه شکل گرفته است؛ تا تجربه جست‌وجوی ملک را
            منظم‌تر و ساده‌تر کند و کاربران بتوانند با توجه به نیاز خود،
            گزینه‌های مناسب را پیدا کنند و با اطلاعات بیشتری تصمیم
            بگیرند.
          </p>

          <p>
            ما باور داریم تکنولوژی زمانی ارزشمند است که یک کار واقعی را
            ساده‌تر کند. سقفینو هم با همین رویکرد طراحی شده است؛ ساده،
            کاربردی و در کنار کاربر.
          </p>
        </div>
      </div>
    </section>

    {/* What We Offer */}
    <section className="bg-gray-1">
      <div className="mx-auto w-full max-w-[1224px] px-5 py-16 md:px-8 md:py-20 lg:px-0">
        <div className="max-w-[650px]">
          <span className="text-xs font-bold text-[#CB1B1B]">
            امکانات سقفینو
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
            همه‌چیز برای یک جست‌وجوی بهتر
          </h2>

          <p className="mt-4 text-sm leading-8 text-gray-8">
            ابزارهای سقفینو برای این طراحی شده‌اند که پیدا کردن و بررسی
            ملک با کمترین پیچیدگی انجام شود.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="
                flex
                min-h-[130px]
                flex-col
                justify-between
                rounded-2xl
                border
                border-gray-3
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-gray-4
                hover:shadow-sm
              "
            >
              <FiCheckCircle
                className="text-[#CB1B1B]"
                size={21}
              />

              <p className="mt-6 text-sm font-bold leading-7 text-gray-10">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1224px] px-5 py-16 md:px-8 md:py-20 lg:px-0">
        <div className="text-center">
          <span className="text-xs font-bold text-[#CB1B1B]">
            ارزش‌های ما
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
            چیزهایی که برای سقفینو مهم‌اند
          </h2>

          <p className="mx-auto mt-4 max-w-[650px] text-sm leading-8 text-gray-8">
            تجربه کاربر، اعتماد و سادگی، پایه‌هایی هستند که سقفینو بر
            اساس آن‌ها ساخته شده است.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="
                  rounded-2xl
                  border
                  border-gray-3
                  bg-white
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#CB1B1B]/20
                  hover:shadow-sm
                "
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CB1B1B]/10 text-[#CB1B1B]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-[15px] font-bold text-gray-11">
                  {value.title}
                </h3>

                <p className="mt-3 text-[12px] leading-7 text-gray-8">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-gray-1">
      <div className="mx-auto w-full max-w-[1224px] px-5 py-16 md:px-8 md:py-20 lg:px-0">
        <div className="overflow-hidden rounded-[24px] bg-[#CB1B1B] px-6 py-10 text-center sm:px-10 md:py-14">
          <h2 className="text-2xl font-bold leading-10 text-white md:text-3xl">
            آماده‌اید خانه بعدی‌تان را پیدا کنید؟
          </h2>

          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-8 text-white/80">
            جست‌وجوی خود را شروع کنید و از میان آگهی‌های موجود، گزینه
            مناسب خود را پیدا کنید.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/buy"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-6
                py-3.5
                text-sm
                font-bold
                text-[#CB1B1B]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-gray-1
              "
            >
              مشاهده املاک
              <FiArrowLeft size={17} />
            </Link>

            <Link
              href="/rent"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-white/30
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-white/10
              "
            >
              مشاهده اجاره‌ها
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</>


);
}
