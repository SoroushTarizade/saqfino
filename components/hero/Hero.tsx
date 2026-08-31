import Image from "next/image";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import Header from "../header/Header";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero */}
      <div className="relative h-[690px] w-full">
        {/* Background Image */}
        <Image
          src="/images/photo.png"
          alt="سقفینو؛ سقفی برای همه"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-30">
          <Header />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-20 text-center">
          {/* Heading */}
          <div className="flex max-w-[1100px] flex-col items-center text-white">
            <h1 className="text-[54px] font-bold leading-[1.3]">
              سقفینو؛ سقفی برای همه
            </h1>

            <p className="mt-3 text-4xl font-bold leading-[1.5]">
              آسانی و سرعت در پیدا کردن یک سقف تازه را در سقفینو تجربه کنید
            </p>
          </div>

          {/* Search Box */}
          <div
            className="
              mt-10
              w-full
              max-w-[816px]
              rounded-md
              bg-white
              p-5
              shadow-lg
            "
          >
            {/* Tabs */}
            <div className="flex justify-center">
              <div
                className="
                  flex
                  w-full
                  max-w-[760px]
                  border-b
                  border-[var(--color-gray-7)]
                "
              >

<Link
  href="/rent"
  className="
    relative
    flex-1
    py-3
    text-center
    text-2xl
    font-bold
    text-[var(--color-gray-10)]
    transition-colors
    duration-200
    hover:text-[var(--color-primary)]
    after:absolute
    after:bottom-[-1px]
    after:right-1/2
    after:h-[2px]
    after:w-0
    after:translate-x-1/2
    after:rounded-full
    after:bg-[var(--color-primary)]
    after:transition-all
    after:duration-300
    hover:after:w-12
  "
>
  اجاره
</Link>

<Link
  href="/buy"
  className="
    relative
    flex-1
    py-3
    text-center
    text-2xl
    font-bold
    text-[var(--color-gray-10)]
    transition-colors
    duration-200
    hover:text-[var(--color-primary)]
    after:absolute
    after:bottom-[-1px]
    after:right-1/2
    after:h-[2px]
    after:w-0
    after:translate-x-1/2
    after:rounded-full
    after:bg-[var(--color-primary)]
    after:transition-all
    after:duration-300
    hover:after:w-12
  "
>
  خرید
</Link>

              </div>
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <IoSearchOutline
                aria-hidden="true"
                className="
                  absolute
                  right-4
                  top-1/2
                  h-6
                  w-6
                  -translate-y-1/2
                  text-[var(--color-gray-8)]
                "
              />

              <input
                type="search"
                aria-label="جستجوی شهر"
                placeholder="شهر مورد نظر را جست‌وجو کنید"
                className="
                  h-12
                  w-full
                  rounded-sm
                  border
                  border-[var(--color-gray-7)]
                  bg-[var(--color-gray-3)]
                  pr-12
                  pl-4
                  text-base
                  text-[var(--color-gray-12)]
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-[var(--color-gray-8)]
                  focus:border-[var(--color-primary)]
                  focus:bg-[var(--color-white)]
                  focus:ring-1
                  focus:ring-[var(--color-primary)]/10
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

