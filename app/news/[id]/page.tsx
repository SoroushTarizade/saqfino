import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ShareButton from "@/components/news/ShareButton";
import { news } from "@/data/news";

type NewsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps) {
  const { id } = await params;

  const newsId = Number(id);
  const article = news.find((item) => item.id === newsId);

  if (!article) {
    notFound();
  }

  const relatedNews = news
    .filter(
      (item) =>
        item.id !== article.id &&
        item.category === article.category,
    )
    .slice(0, 3);

  return (
    <>
      <Header />

      <main dir="rtl" className="bg-white">
        {/* Breadcrumb */}
        <section className="mx-auto w-full max-w-[1224px] px-4 pt-24 md:px-6 md:pt-28 lg:px-0 lg:pt-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              خانه
            </Link>

            <FiArrowRight className="text-xs" />

            <Link
              href="/news"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              اخبار
            </Link>

            <FiArrowRight className="text-xs" />

            <span className="line-clamp-1 text-gray-700">
              {article.title}
            </span>
          </div>
        </section>

        {/* Article */}
        <article className="mx-auto w-full max-w-[1000px] px-4 py-8 md:px-6 md:py-12 lg:px-0 lg:py-16">
          {/* Category */}
          <div className="mb-5">
            <span className="inline-flex rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="max-w-[900px] text-2xl font-bold leading-[1.7] text-gray-900 md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>{article.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiClock />
              <span>{article.readTime} دقیقه مطالعه</span>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1000px"
            />
          </div>

          {/* Content */}
          <div className="mt-10">
            <p className="text-lg font-bold leading-9 text-gray-800 md:text-xl md:leading-10">
              {article.excerpt}
            </p>

            <div className="mt-8 space-y-6 text-base leading-9 text-gray-600 md:text-lg md:leading-10">
              <p>
                بازار مسکن یکی از مهم‌ترین بخش‌های اقتصاد و زندگی
                خانوارهاست. انتخاب درست یک ملک نیازمند بررسی دقیق
                شرایط، قیمت، موقعیت مکانی و وضعیت حقوقی آن است.
              </p>

              <p>
                قبل از هر تصمیمی بهتر است اطلاعات کافی درباره ملکی
                که قصد خرید، فروش یا اجاره آن را دارید به دست آورید.
                بررسی قیمت‌های منطقه، مقایسه گزینه‌های مختلف و
                استفاده از تجربه مشاوران حرفه‌ای می‌تواند ریسک
                تصمیم‌گیری را کاهش دهد.
              </p>

              <p>
                همچنین توجه به جزئیاتی مانند سن بنا، متراژ، دسترسی
                به امکانات شهری، وضعیت سند و شرایط قرارداد اهمیت
                زیادی دارد. بسیاری از مشکلاتی که پس از معامله ایجاد
                می‌شوند، با یک بررسی دقیق قبل از قرارداد قابل
                پیشگیری هستند.
              </p>

              <p>
                در نهایت، بهتر است قبل از نهایی کردن هر معامله،
                تمام اطلاعات مربوط به ملک را بررسی کرده و در صورت
                نیاز از افراد متخصص کمک بگیرید تا تصمیمی مطمئن‌تر
                و آگاهانه‌تر داشته باشید.
              </p>
            </div>
          </div>

          {/* Share / Back */}
          <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <FiArrowRight />
              بازگشت به اخبار
            </Link>

            <ShareButton
              title={article.title}
              text={article.excerpt}
            />
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="mx-auto w-full max-w-[1224px] px-4 pb-16 md:px-6 lg:px-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                مطالب مرتبط
              </h2>

              <Link
                href="/news"
                className="text-sm font-bold text-[var(--color-primary)]"
              >
                مشاهده همه اخبار
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {item.category}
                    </span>

                    <h3 className="mt-3 line-clamp-2 text-base font-bold leading-7 text-gray-900">
                      {item.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {item.date}
                      </span>

                      <span className="flex items-center gap-1">
                        <FiClock />
                        {item.readTime} دقیقه
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}