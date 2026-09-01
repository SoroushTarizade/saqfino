"use client";

import Image from "next/image";
import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const newsItems = [
  {
    id: 1,
    image: "/images/New1.png",
    title:
      "رکود بازار مسکن؛ فروشندگان در انتظار خریداران و خریداران در انتظار شکست نرخ فروشندگان",
  },
  {
    id: 2,
    image: "/images/New2.png",
    title:
      "خطر ویرانی زلزله در آسمان‌خراش‌ها بیشتر است یا در آپارتمان‌های کم‌ارتفاع و یا خانه‌های ویلایی؟",
  },
  {
    id: 3,
    image: "/images/New3.png",
    title:
      "بازار کساد کسب‌وکار معماران داخلی در پی بالا رفتن قیمت مواد و متریال اولیه و مصالح خارجی",
  },
  {
    id: 4,
    image: "/images/New4.png",
    title:
      "شهرک ساحلی زمزم در منطقه نور استان مازندران از سوم شهریور وارد بازار مزایده شده است.",
  },
  {
    id: 5,
    image: "/images/New1.png",
    title:
      "بررسی وضعیت بازار مسکن و پیش‌بینی قیمت خانه در ماه‌های آینده",
  },
  {
    id: 6,
    image: "/images/New3.png",
    title:
      "بهترین مناطق برای خرید خانه در تهران؛ بررسی قیمت و شرایط بازار",
  },
  {
    id: 7,
    image: "/images/New1.png",
    title:
      "چطور قبل از خرید خانه، ارزش واقعی ملک را بهتر بررسی کنیم؟",
  },
  {
    id: 8,
    image: "/images/New1.png",
    title:
      "تأثیر تغییرات اقتصادی بر بازار اجاره و خرید و فروش مسکن",
  },
];

export default function New() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "next" | "prev") => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth * 0.8;

    sliderRef.current.scrollBy({
      left: direction === "next" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1224px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between md:mb-10">
          <h2 className="text-2xl font-bold leading-relaxed text-gray-11 sm:text-3xl md:text-4xl">
            آخرین اخبار و مطالب
          </h2>

          {/* Desktop Controls */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollSlider("next")}
              aria-label="اخبار قبلی"
              className="
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
                duration-200
                hover:border-primary
                hover:bg-primary
                hover:text-white
                active:scale-95
              "
            >
              <IoChevronForward className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("prev")}
              aria-label="اخبار بعدی"
              className="
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
                duration-200
                hover:border-primary
                hover:bg-primary
                hover:text-white
                active:scale-95
              "
            >
              <IoChevronBack className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* News Slider */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            pb-3
            snap-x
            snap-mandatory

            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]

            md:gap-5
            md:pb-1
          "
        >
          {newsItems.map((news) => (
            <article
              key={news.id}
              className="
                group
                relative
                min-w-[calc(100vw-32px)]
                snap-center
                overflow-hidden
                rounded-lg
                bg-gray-2
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]

                sm:min-w-[340px]

                md:min-w-[calc((100%-60px)/4)]
                md:snap-start
              "
            >
              {/* Image */}
              <div className="relative h-[220px] w-full overflow-hidden sm:h-[230px] md:h-[238px]">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  sizes="
                    (max-width: 767px) calc(100vw - 32px),
                    (max-width: 1023px) 340px,
                    288px
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Content */}
              <div className="flex min-h-[120px] items-center px-5 py-5">
                <h3
                  className="
                    line-clamp-2
                    text-justify
                    text-base
                    font-bold
                    leading-8
                    text-gray-10
                    transition-colors
                    duration-200
                    group-hover:text-gray-12

                    sm:text-lg
                  "
                >
                  {news.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile hint */}
        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          <span className="text-xs text-gray-8">
            برای دیدن اخبار بیشتر به طرفین بکشید
          </span>
        </div>
      </div>
    </section>
  );
}
