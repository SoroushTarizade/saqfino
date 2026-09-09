"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiShield,
} from "react-icons/fi";

import { FaTelegram } from "react-icons/fa";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";


const contactMethods = [
{
icon: FiPhone,
title: "تماس تلفنی",
description: "برای سوالات فوری و راهنمایی بیشتر",
value: "۰۹۱۸۶۵۴۷۴۱۶",
href: "tel:+989186547416",
},
{
icon: FiMail,
title: "ایمیل",
description: "برای ارسال درخواست و پیام",
value: "[soroushtarizadeh7139@gmail.com](mailto:soroushtarizadeh7139@gmail.com)",
href: "mailto:soroushtarizadeh7139@gmail.com",
},
{
icon: FiInstagram,
title: "اینستاگرام",
description: "برای ارتباط و دنبال کردن سقفینو",
value: "@soroush_tr9",
href: "https://instagram.com/soroush_tr9",
},
{
icon: FaTelegram,
title: "تلگرام",
description: "برای ارتباط سریع‌تر",
value: "@soroush_tr9",
href: "https://t.me/soroush_tr9",
},
];

const faqs = [
{
question: "چطور می‌توانم یک ملک را در سقفینو پیدا کنم؟",
answer:
"از بخش خرید یا اجاره وارد لیست املاک شوید و با استفاده از جست‌وجو و فیلترها، ملک مناسب خود را بر اساس شهر، منطقه، قیمت، متراژ و سایر ویژگی‌ها پیدا کنید.",
},
{
question: "آیا می‌توانم در سقفینو آگهی ثبت کنم؟",
answer:
"بله. کافی است وارد حساب کاربری خود شوید و از بخش ثبت آگهی، اطلاعات ملک و تصاویر آن را وارد کنید.",
},
{
question: "اگر درباره یک آگهی سوال داشته باشم چه کار کنم؟",
answer:
"می‌توانید اطلاعات تماس موجود در آگهی را بررسی کنید یا در صورت داشتن سوال عمومی درباره عملکرد سقفینو، از فرم تماس همین صفحه استفاده کنید.",
},
{
question: "چطور می‌توانم با تیم سقفینو در ارتباط باشم؟",
answer:
"می‌توانید از طریق تماس تلفنی، ایمیل، اینستاگرام، تلگرام یا فرم ارسال پیام با ما در ارتباط باشید.",
},
];

export default function ContactPage() {
const [openFaq, setOpenFaq] = useState<number | null>(0);

const [formData, setFormData] = useState({
name: "",
email: "",
subject: "",
message: "",
});

const [isSubmitting, setIsSubmitting] = useState(false);
const [status, setStatus] = useState<{
type: "success" | "error" | null;
message: string;
}>({
type: null,
message: "",
});

const handleChange = (
field: keyof typeof formData,
value: string,
) => {
setFormData((prev) => ({
...prev,
[field]: value,
}));


if (status.type) {
  setStatus({
    type: null,
    message: "",
  });
}


};

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (
  !formData.name.trim() ||
  !formData.email.trim() ||
  !formData.message.trim()
) {
  setStatus({
    type: "error",
    message: "لطفاً نام، ایمیل و متن پیام را وارد کنید.",
  });
  return;
}

setIsSubmitting(true);
setStatus({
  type: null,
  message: "",
});

try {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const text = await response.text();

  let data: {
    message?: string;
  } = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "ارسال پیام با مشکل مواجه شد.",
    );
  }

  setStatus({
    type: "success",
    message:
      data.message ||
      "پیام شما با موفقیت ارسال شد. به‌زودی با شما در ارتباط خواهیم بود.",
  });

  setFormData({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
} catch (error) {
  setStatus({
    type: "error",
    message:
      error instanceof Error
        ? error.message
        : "ارسال پیام با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
  });
} finally {
  setIsSubmitting(false);
}


};

return (
<>
{/* Header */} <Header />


  <main dir="rtl" className="min-h-screen bg-white text-gray-13">
    {/* Hero */}
    <section className="border-b border-gray-3 bg-gray-1">
      <div className="mx-auto w-full max-w-[1224px] px-5 py-14 md:px-8 md:py-20 lg:px-0 lg:py-24">
        <div className="max-w-[720px]">
          <span className="inline-flex rounded-full bg-[#CB1B1B]/10 px-4 py-2 text-[11px] font-bold text-[#CB1B1B] md:text-[12px]">
            ارتباط با سقفینو
          </span>

          <h1 className="mt-5 text-2xl font-bold leading-[1.8] text-gray-13 sm:text-3xl md:text-4xl">
            همیشه راهی برای
            <span className="text-[#CB1B1B]"> ارتباط</span> هست
          </h1>

          <p className="mt-5 max-w-[650px] text-justify text-sm leading-8 text-gray-8 md:text-[15px] md:leading-9">
            سوالی دارید، پیشنهادی برای بهتر شدن سقفینو دارید یا می‌خواهید
            درباره خدمات و امکانات آن بیشتر بدانید؟ پیام خود را برای ما
            ارسال کنید؛ خوشحال می‌شویم صدای شما را بشنویم.
          </p>
        </div>
      </div>
    </section>

    {/* Contact Methods */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1224px] px-5 py-14 md:px-8 md:py-20 lg:px-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;

            return (
              <a
                key={method.title}
                href={method.href}
                target={
                  method.href.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-3
                  bg-white
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#CB1B1B]/20
                  hover:shadow-sm
                "
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CB1B1B]/10 text-[#CB1B1B] transition-colors duration-300 group-hover:bg-[#CB1B1B] group-hover:text-white">
                  <Icon size={20} />
                </div>

                <h2 className="mt-5 text-[14px] font-bold text-gray-11">
                  {method.title}
                </h2>

                <p className="mt-2 text-[12px] leading-6 text-gray-7">
                  {method.description}
                </p>

                <p className="mt-4 truncate text-[12px] font-bold text-[#CB1B1B]">
                  {method.value}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>

    {/* Contact Form */}
    <section className="bg-gray-1">
      <div className="mx-auto grid w-full max-w-[1224px] gap-8 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-0">
        {/* Information */}
        <div className="flex flex-col justify-between rounded-[24px] bg-[#CB1B1B] p-7 text-white sm:p-9 md:p-10">
          <div>
            <span className="text-xs font-bold text-white/70">
              در کنار شما هستیم
            </span>

            <h2 className="mt-4 text-2xl font-bold leading-10 md:text-3xl">
              بیایید با هم
              <br />
              در ارتباط باشیم
            </h2>

            <p className="mt-5 text-justify text-sm leading-8 text-white/80">
              چه درباره خرید و اجاره ملک سوالی داشته باشید، چه پیشنهادی
              برای بهتر شدن سقفینو؛ پیام شما برای ما ارزشمند است.
            </p>
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FiClock size={19} />
              </span>

              <div>
                <p className="text-xs text-white/60">
                  زمان پاسخ‌گویی
                </p>
                <p className="mt-1 text-sm font-bold">
                  در اولین فرصت ممکن
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FiMapPin size={19} />
              </span>

              <div>
                <p className="text-xs text-white/60">
                  محدوده فعالیت
                </p>
                <p className="mt-1 text-sm font-bold">
                  تهران و سراسر ایران
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FiShield size={19} />
              </span>

              <div>
                <p className="text-xs text-white/60">
                  ارتباط مستقیم
                </p>
                <p className="mt-1 text-sm font-bold">
                  پاسخ‌گویی به پیام‌های کاربران
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-[24px] border border-gray-3 bg-white p-6 sm:p-8 md:p-10">
          <div>
            <span className="text-xs font-bold text-[#CB1B1B]">
              ارسال پیام
            </span>

            <h2 className="mt-3 text-2xl font-bold leading-10 text-gray-13">
              پیام خود را برای ما بنویسید
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-7">
              فرم زیر را تکمیل کنید تا پیام شما برای ما ارسال شود.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-bold text-gray-10"
                >
                  نام و نام خانوادگی
                </label>

                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="نام خود را وارد کنید"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-4
                    bg-white
                    px-4
                    text-sm
                    text-gray-10
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-6
                    hover:border-gray-6
                    focus:border-[#CB1B1B]
                    focus:ring-4
                    focus:ring-[#CB1B1B]/10
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-gray-10"
                >
                  ایمیل
                </label>

                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  placeholder="example@email.com"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-4
                    bg-white
                    px-4
                    text-left
                    text-sm
                    text-gray-10
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-6
                    hover:border-gray-6
                    focus:border-[#CB1B1B]
                    focus:ring-4
                    focus:ring-[#CB1B1B]/10
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-xs font-bold text-gray-10"
              >
                موضوع پیام
              </label>

              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(event) =>
                  handleChange("subject", event.target.value)
                }
                placeholder="موضوع پیام را وارد کنید"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-4
                  bg-white
                  px-4
                  text-sm
                  text-gray-10
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-gray-6
                  hover:border-gray-6
                  focus:border-[#CB1B1B]
                  focus:ring-4
                  focus:ring-[#CB1B1B]/10
                "
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-xs font-bold text-gray-10"
              >
                متن پیام
              </label>

              <textarea
                id="message"
                value={formData.message}
                onChange={(event) =>
                  handleChange("message", event.target.value)
                }
                placeholder="پیام خود را بنویسید..."
                rows={6}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-4
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  leading-7
                  text-gray-10
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-gray-6
                  hover:border-gray-6
                  focus:border-[#CB1B1B]
                  focus:ring-4
                  focus:ring-[#CB1B1B]/10
                "
              />
            </div>

            {status.type && (
              <div
                className={`flex items-start gap-3 rounded-xl px-4 py-3 text-xs leading-6 ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.type === "success" ? (
                  <FiCheckCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <FiMessageCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                inline-flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#CB1B1B]
                px-6
                text-sm
                font-bold
                text-white
                transition-all
                duration-300
                hover:bg-[#b81717]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  ارسال پیام
                  <FiSend size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[900px] px-5 py-16 md:px-8 md:py-20 lg:px-0">
        <div className="text-center">
          <span className="text-xs font-bold text-[#CB1B1B]">
            سوالات متداول
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-10 text-gray-13 md:text-3xl">
            شاید پاسخ سوال شما اینجا باشد
          </h2>

          <p className="mx-auto mt-4 max-w-[620px] text-sm leading-8 text-gray-7">
            قبل از ارسال پیام می‌توانید پاسخ بعضی از سوالات رایج درباره
            سقفینو را اینجا پیدا کنید.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className={`
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  transition-colors
                  duration-200
                  ${
                    isOpen
                      ? "border-[#CB1B1B]/20"
                      : "border-gray-3"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-5
                    text-right
                  "
                >
                  <span className="text-sm font-bold leading-7 text-gray-10">
                    {faq.question}
                  </span>

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200
                      ${
                        isOpen
                          ? "bg-[#CB1B1B] text-white"
                          : "bg-gray-2 text-gray-7"
                      }
                    `}
                  >
                    <FiChevronDown
                      size={17}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  className={`
                    grid
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-justify text-[13px] leading-8 text-gray-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <FiHomeIcon />
          </div>

          <h2 className="mt-5 text-2xl font-bold leading-10 text-white md:text-3xl">
            هنوز دنبال خانه مناسب هستید؟
          </h2>

          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-8 text-white/80">
            شاید بهترین پاسخ، پیدا کردن خانه‌ای باشد که دقیقاً با نیاز
            شما مطابقت دارد.
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

  {/* Footer */}
  <Footer />
</>


);
}

function FiHomeIcon() {
return ( <svg
   width="21"
   height="21"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
 > <path d="m3 10 9-7 9 7" /> <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /> <path d="M9 21v-6h6v6" /> </svg>
);
}
