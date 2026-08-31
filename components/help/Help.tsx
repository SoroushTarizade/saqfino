"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cards = [
  {
    image: "/images/Help3.svg",
    title: "به آسانی یک خانه اجاره کنید",
    description:
      "در میان صدها آگهی که روزانه به وب‌سایت سقفینو افزوده می‌شود، با استفاده از بیش از ۲۸ فیلتر کاربردی تلاش کرده‌ایم خانه‌ای که در جست‌وجوی آن هستید را هر چه سریعتر پیدا و اجاره کنید.",
    button: "اجاره خانه",
    href: "/rent",
  },
  {
    image: "/images/Help2.svg",
    title: "خانه مورد علاقه‌تان را بخرید",
    description:
      "بالای ۱ میلیون آگهی فروش در وب‌سایت سقفینو وجود دارد. ما علاوه بر آگهی‌های فراوان با به‌کارگیری املاک و مشاورین متخصص در هر شهر، تلاش می‌کنیم در تجربه لذت یک خرید آسان با شما سهیم باشیم.",
    button: "خرید خانه",
    href: "/buy",
  },
  {
    image: "/images/Help1.svg",
    title: "مالک هستید؟",
    description:
      "آیا می‌دانید میانگین بازدید از وب‌سایت به‌طور متوسط روزانه بالای هزاران نفر است؟ پس به‌سادگی و با چند کلیک ساده، ملک‌تان را به‌صورت رایگان در سقفینو آگهی و در سریع‌ترین زمان ممکن معامله کنید.",
    button: "ثبت آگهی",
    href: "/submit",
  },
];

export default function Help() {
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % cards.length);
  };

  const goToPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + cards.length) % cards.length
    );
  };

  /* =========================================================
     Mobile Auto Slide
     ========================================================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    if (!mediaQuery.matches) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     Touch / Swipe
     ========================================================= */

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    touchEndX.current = event.changedTouches[0].clientX;

    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    const minimumSwipeDistance = 50;

    if (Math.abs(distance) < minimumSwipeDistance) {
      return;
    }

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* =========================================================
     Mouse Drag
     ========================================================= */

  const mouseStartX = useRef<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    mouseStartX.current = event.clientX;
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (mouseStartX.current === null) return;

    const distance = mouseStartX.current - event.clientX;

    if (Math.abs(distance) < 50) {
      mouseStartX.current = null;
      return;
    }

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }

    mouseStartX.current = null;
  };

  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1224px]">
        {/* ===================================================
            Section Header
        =================================================== */}

        <div className="mb-10 md:mb-12">
          <h2 className="text-2xl font-bold text-gray-11 md:text-4xl">
            سقفینو چطور به خانه‌دار شدن شما کمک می‌کند
          </h2>
        </div>

        {/* ===================================================
            Desktop / Tablet
        =================================================== */}

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="
                group
                flex
                min-h-[511px]
                flex-col
                justify-between
                rounded-lg
                bg-gray-3
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div>
                {/* Image */}

                <div className="mb-6 flex justify-center">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={280}
                    height={145}
                    className="
                      h-[145px]
                      w-[280px]
                      object-contain
                      transition-transform
                      duration-300
                      group-hover:scale-[1.03]
                    "
                  />
                </div>

                {/* Content */}

                <div className="text-center">
                  <h3 className="mb-3 text-xl font-bold text-gray-11">
                    {card.title}
                  </h3>

                  <p className="text-justify text-sm leading-8 text-gray-10">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Button */}

              <Link
                href={card.href}
                className="
                  mt-6
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-sm
                  bg-primary
                  text-sm
                  font-bold
                  !text-white
                  transition-all
                  duration-200
                  hover:bg-primary-shade-1
                  active:scale-[0.98]
                "
              >
                {card.button}
              </Link>
            </div>
          ))}
        </div>

        {/* ===================================================
            Mobile Slider
        =================================================== */}

        <div className="md:hidden">
          <div
            className="
              relative
              overflow-hidden
              rounded-lg
              select-none
              touch-pan-y
            "
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div
              className="
                flex
                transition-transform
                duration-500
                ease-out
              "
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="
                    min-w-full
                    rounded-lg
                    bg-gray-3
                    p-6
                  "
                >
                  {/* Image */}

                  <div className="mb-6 flex justify-center">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={280}
                      height={145}
                      draggable={false}
                      className="
                        h-auto
                        w-full
                        max-w-[280px]
                        object-contain
                      "
                    />
                  </div>

                  {/* Content */}

                  <div className="text-center">
                    <h3 className="mb-3 text-xl font-bold text-gray-11">
                      {card.title}
                    </h3>

                    <p className="text-justify text-sm leading-8 text-gray-10">
                      {card.description}
                    </p>
                  </div>

                  {/* Button */}

                  <Link
                    href={card.href}
                    className="
                      mt-6
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      rounded-sm
                      bg-primary
                      text-sm
                      font-bold
                      !text-white
                      transition-all
                      duration-200
                      hover:bg-primary-shade-1
                      active:scale-[0.98]
                    "
                    onClick={(event) => event.stopPropagation()}
                  >
                    {card.button}
                  </Link>
                </div>
              ))}
            </div>

            {/* =================================================
                Navigation Arrows
            ================================================= */}

            <button
              type="button"
              aria-label="قبلی"
              onClick={goToPrevious}
              className="
                absolute
                right-2
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-gray-11
                shadow-md
                transition-all
                duration-200
                hover:bg-primary
                hover:text-white
                active:scale-90
              "
            >
              ‹
            </button>

            <button
              type="button"
              aria-label="بعدی"
              onClick={goToNext}
              className="
                absolute
                left-2
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-gray-11
                shadow-md
                transition-all
                duration-200
                hover:bg-primary
                hover:text-white
                active:scale-90
              "
            >
              ›
            </button>
          </div>

          {/* =================================================
              Pagination
          ================================================= */}

          <div className="mt-5 flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`رفتن به اسلاید ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    activeIndex === index
                      ? "w-6 bg-primary"
                      : "w-2 bg-gray-6 hover:bg-gray-8"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
