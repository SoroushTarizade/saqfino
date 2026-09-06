"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiSearch,
} from "react-icons/fi";

import {
  news,
  newsCategories,
  type NewsCategory,
} from "@/data/news";

export default function News() {
  const [activeCategory, setActiveCategory] =
    useState<NewsCategory>("همه");

  const [search, setSearch] = useState("");

  const featuredNews = news.filter(
    (item) => item.featured,
  );

  const filteredNews = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return news.filter((item) => {
      const matchesCategory =
        activeCategory === "همه" ||
        item.category === activeCategory;

      const matchesSearch =
        !searchValue ||
        item.title.toLowerCase().includes(searchValue) ||
        item.excerpt.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white"
    >
      {/* Hero */}
      <section className="mx-auto w-full max-w-[1224px] px-4 pb-8 pt-24 md:px-6 lg:px-0 lg:pt-10">
        <div className="max-w-[760px]">
          <span className="text-sm font-bold text-primary">
            مجله سقفینو
          </span>

          <h1 className="mt-3 text-3xl font-bold leading-[1.7] text-gray-13 md:text-4xl">
            اخبار و مقالات حوزه
            <span className="text-primary">
              {" "}
              مسکن و املاک
            </span>
          </h1>

          <p className="mt-4 max-w-[680px] text-sm leading-8 text-gray-8 md:text-base">
            جدیدترین اخبار بازار مسکن، راهنمای خرید و اجاره،
            نکات سرمایه‌گذاری و مطالب کاربردی حوزه املاک را
            در مجله سقفینو دنبال کنید.
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-8 max-w-[600px]">
          <FiSearch
            className="
              pointer-events-none absolute right-4 top-1/2
              h-5 w-5 -translate-y-1/2 text-gray-8
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="جستجو در اخبار و مقالات..."
            className="
              h-14 w-full rounded-lg
              border border-gray-4 bg-white
              pr-12 pl-4 text-sm text-gray-11
              outline-none transition
              placeholder:text-gray-7
              focus:border-primary
              focus:ring-2 focus:ring-primary/10
            "
          />
        </div>
      </section>

      {/* Featured */}
      {!search && activeCategory === "همه" && (
        <section className="mx-auto w-full max-w-[1224px] px-4 py-6 md:px-6 lg:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-13 md:text-2xl">
                مطالب منتخب
              </h2>

              <p className="mt-2 text-sm text-gray-8">
                مطالبی که این روزها بیشتر مورد توجه کاربران
                سقفینو هستند.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {featuredNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="
                  group relative overflow-hidden
                  rounded-2xl bg-gray-13
                "
              >
                <div className="relative h-[300px] md:h-[360px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="
                      object-cover
                      transition duration-500
                      group-hover:scale-105
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                    <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold">
                      {item.category}
                    </span>

                    <h3 className="mt-4 max-w-[560px] text-xl font-bold leading-8 md:text-2xl">
                      {item.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/80">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="h-4 w-4" />
                        {item.date}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FiClock className="h-4 w-4" />
                        {item.readTime} دقیقه مطالعه
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto w-full max-w-[1224px] px-4 py-8 md:px-6 lg:px-0">
        <div
          className="
            flex gap-2 overflow-x-auto pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {newsCategories.map((category) => {
            const isActive =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  shrink-0 rounded-full px-5 py-2.5
                  text-sm font-bold transition
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-gray-3 text-gray-9 hover:bg-primary-tint-1 hover:text-primary"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* News Grid */}
      <section className="mx-auto w-full max-w-[1224px] px-4 pb-16 md:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-13 md:text-2xl">
              {activeCategory === "همه"
                ? "آخرین مطالب"
                : activeCategory}
            </h2>

            <p className="mt-2 text-sm text-gray-8">
              {filteredNews.length.toLocaleString(
                "fa-IR",
              )}{" "}
              مطلب
            </p>
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="
                  group overflow-hidden rounded-xl
                  border border-gray-4 bg-white
                  transition duration-300
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-lg
                "
              >
                <div className="relative h-[210px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="
                      object-cover
                      transition duration-500
                      group-hover:scale-105
                    "
                  />

                  <span
                    className="
                      absolute right-4 top-4
                      rounded-full bg-white/95
                      px-3 py-1.5 text-xs
                      font-bold text-primary
                      shadow-sm
                    "
                  >
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3
                    className="
                      line-clamp-2 min-h-[56px]
                      text-base font-bold leading-7
                      text-gray-12
                      transition group-hover:text-primary
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3 line-clamp-2
                      text-sm leading-7 text-gray-8
                    "
                  >
                    {item.excerpt}
                  </p>

                  <div
                    className="
                      mt-5 flex items-center
                      justify-between border-t
                      border-gray-4 pt-4
                      text-xs text-gray-8
                    "
                  >
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="h-4 w-4" />
                      {item.date}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiClock className="h-4 w-4" />
                      {item.readTime} دقیقه
                    </span>
                  </div>

                  <div
                    className="
                      mt-4 flex items-center
                      gap-2 text-sm font-bold
                      text-primary
                    "
                  >
                    مطالعه مقاله

                    <FiArrowLeft
                      className="
                        h-4 w-4
                        transition-transform
                        group-hover:-translate-x-1
                      "
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-8 rounded-xl border
              border-gray-4 bg-gray-3
              px-6 py-16 text-center
            "
          >
            <FiSearch className="mx-auto h-8 w-8 text-gray-7" />

            <h3 className="mt-4 font-bold text-gray-11">
              مطلبی پیدا نشد
            </h3>

            <p className="mt-2 text-sm text-gray-8">
              عبارت جستجو یا دسته‌بندی انتخابی را تغییر دهید.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("همه");
              }}
              className="
                mt-5 rounded-lg
                bg-primary px-5 py-2.5
                text-sm font-bold text-white
                transition hover:bg-primary-shade-1
              "
            >
              نمایش همه مطالب
            </button>
          </div>
        )}
      </section>
    </main>
  );
}