"use client";

import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiHome,
  FiKey,
} from "react-icons/fi";

type TransactionType = "فروش" | "اجاره" | null;

type PropertyType =
  | "آپارتمان"
  | "خانه"
  | "ویلا"
  | "زمین"
  | "تجاری"
  | null;

const steps = [
  "نوع آگهی",
  "مشخصات ملک",
  "قیمت",
  "امکانات",
  "تصاویر",
  "موقعیت",
];

const propertyTypes: {
  title: Exclude<PropertyType, null>;
  description: string;
}[] = [
  {
    title: "آپارتمان",
    description: "واحد آپارتمانی",
  },
  {
    title: "خانه",
    description: "خانه مستقل",
  },
  {
    title: "ویلا",
    description: "ویلا و باغ‌ویلا",
  },
  {
    title: "زمین",
    description: "زمین مسکونی یا تجاری",
  },
  {
    title: "تجاری",
    description: "مغازه، دفتر و ملک تجاری",
  },
];

export default function Submit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionType, setTransactionType] =
    useState<TransactionType>(null);
  const [propertyType, setPropertyType] =
    useState<PropertyType>(null);

  const canContinue = () => {
    if (currentStep === 1) {
      return transactionType !== null && propertyType !== null;
    }

    return true;
  };

  const handleNext = () => {
    if (!canContinue()) return;

    setCurrentStep((prev) =>
      Math.min(prev + 1, steps.length)
    );
  };

  const handlePrevious = () => {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--color-gray-2)]"
    >
      {/* Header section */}
      <section className="border-b border-[var(--color-gray-4)] bg-white">
        <div className="mx-auto w-full max-w-[1224px] px-4 py-8 md:px-6 lg:px-0">
          <div className="max-w-[720px]">
            <span className="text-sm font-bold text-[var(--color-primary)]">
              ثبت آگهی
            </span>

            <h1 className="mt-2 text-2xl font-bold text-[var(--color-gray-13)] md:text-3xl">
              ملک خود را در سقفینو ثبت کنید
            </h1>

            <p className="mt-3 text-sm leading-7 text-[var(--color-gray-8)] md:text-base">
              اطلاعات ملک خود را وارد کنید تا آگهی شما برای
              خریداران و مستأجران نمایش داده شود.
            </p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1224px] px-4 py-6 md:px-6 lg:px-0">
          <div className="overflow-x-auto">
            <div className="flex min-w-[650px] items-center">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted =
                  currentStep > stepNumber;

                return (
                  <div
                    key={step}
                    className="flex flex-1 items-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-sm
                          font-bold
                          transition-all
                          ${
                            isCompleted || isActive
                              ? "bg-[var(--color-primary)] text-white"
                              : "border border-[var(--color-gray-5)] bg-white text-[var(--color-gray-7)]"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <FiCheck size={16} />
                        ) : (
                          stepNumber
                        )}
                      </div>

                      <span
                        className={`
                          whitespace-nowrap
                          text-xs
                          font-bold
                          ${
                            isActive || isCompleted
                              ? "text-[var(--color-gray-13)]"
                              : "text-[var(--color-gray-7)]"
                          }
                        `}
                      >
                        {step}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`
                          mx-3
                          mb-6
                          h-px
                          flex-1
                          transition-all
                          ${
                            isCompleted
                              ? "bg-[var(--color-primary)]"
                              : "bg-[var(--color-gray-4)]"
                          }
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main form */}
      <section className="mx-auto w-full max-w-[1224px] px-4 py-8 md:px-6 md:py-10 lg:px-0">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl border border-[var(--color-gray-4)] bg-white p-5 shadow-sm md:p-8">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                    نوع آگهی را انتخاب کنید
                  </h2>

                  <p className="mt-2 text-sm text-[var(--color-gray-8)]">
                    ابتدا مشخص کنید قصد فروش یا اجاره ملک را دارید.
                  </p>
                </div>

                {/* Transaction */}
                <div className="mt-8">
                  <label className="mb-3 block text-sm font-bold text-[var(--color-gray-13)]">
                    نوع معامله
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTransactionType("فروش")
                      }
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-5
                        text-right
                        transition-all
                        ${
                          transactionType === "فروش"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-gray-4)] hover:border-[var(--color-primary)]/50"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            transactionType === "فروش"
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-[var(--color-gray-3)] text-[var(--color-gray-8)]"
                          }
                        `}
                      >
                        <FiHome size={22} />
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-[var(--color-gray-13)]">
                          فروش
                        </span>

                        <span className="mt-1 block text-xs text-[var(--color-gray-7)]">
                          فروش ملک
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTransactionType("اجاره")
                      }
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-5
                        text-right
                        transition-all
                        ${
                          transactionType === "اجاره"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-gray-4)] hover:border-[var(--color-primary)]/50"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            transactionType === "اجاره"
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-[var(--color-gray-3)] text-[var(--color-gray-8)]"
                          }
                        `}
                      >
                        <FiKey size={22} />
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-[var(--color-gray-13)]">
                          اجاره
                        </span>

                        <span className="mt-1 block text-xs text-[var(--color-gray-7)]">
                          رهن و اجاره ملک
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Property type */}
                <div className="mt-8">
                  <label className="mb-3 block text-sm font-bold text-[var(--color-gray-13)]">
                    نوع ملک
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {propertyTypes.map((property) => {
                      const isSelected =
                        propertyType === property.title;

                      return (
                        <button
                          key={property.title}
                          type="button"
                          onClick={() =>
                            setPropertyType(property.title)
                          }
                          className={`
                            rounded-xl
                            border
                            p-4
                            text-right
                            transition-all
                            ${
                              isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                : "border-[var(--color-gray-4)] hover:border-[var(--color-primary)]/50"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="block text-sm font-bold text-[var(--color-gray-13)]">
                                {property.title}
                              </span>

                              <span className="mt-1 block text-xs text-[var(--color-gray-7)]">
                                {property.description}
                              </span>
                            </div>

                            <span
                              className={`
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  isSelected
                                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                                    : "border-[var(--color-gray-5)]"
                                }
                              `}
                            >
                              {isSelected && (
                                <FiCheck
                                  size={12}
                                  className="text-white"
                                />
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                  مشخصات ملک
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
                  در این مرحله اطلاعات اصلی ملک را وارد خواهید کرد.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "متراژ",
                    "تعداد اتاق",
                    "طبقه",
                    "تعداد طبقات",
                    "سال ساخت",
                  ].map((item) => (
                    <div key={item}>
                      <label className="mb-2 block text-sm font-bold text-[var(--color-gray-13)]">
                        {item}
                      </label>

                      <input
                        type="text"
                        placeholder={`مثلاً ${item}`}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--color-gray-4)]
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition-all
                          placeholder:text-[var(--color-gray-6)]
                          focus:border-[var(--color-primary)]
                          focus:ring-2
                          focus:ring-[var(--color-primary)]/10
                        "
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                  قیمت ملک
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
                  اطلاعات قیمت را در این مرحله وارد کنید.
                </p>

                <div className="mt-8 rounded-2xl bg-[var(--color-gray-2)] p-5">
                  <p className="text-sm font-bold text-[var(--color-gray-13)]">
                    نوع معامله انتخاب‌شده
                  </p>

                  <p className="mt-2 text-sm text-[var(--color-primary)]">
                    {transactionType}
                  </p>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-[var(--color-gray-13)]">
                    {transactionType === "فروش"
                      ? "قیمت کل"
                      : "ودیعه"}
                  </label>

                  <input
                    type="text"
                    placeholder="مثلاً ۵۰۰ میلیون تومان"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[var(--color-gray-4)]
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition-all
                      focus:border-[var(--color-primary)]
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                  />
                </div>

                {transactionType === "اجاره" && (
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-[var(--color-gray-13)]">
                      اجاره ماهانه
                    </label>

                    <input
                      type="text"
                      placeholder="مثلاً ۱۵ میلیون تومان"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-gray-4)]
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition-all
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                  امکانات ملک
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
                  امکاناتی که ملک شما دارد را انتخاب کنید.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    "پارکینگ",
                    "آسانسور",
                    "انباری",
                    "بالکن",
                    "استخر",
                    "سونا",
                    "جکوزی",
                    "نگهبانی",
                    "لابی",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="
                        rounded-xl
                        border
                        border-[var(--color-gray-4)]
                        px-4
                        py-4
                        text-sm
                        font-bold
                        text-[var(--color-gray-10)]
                        transition-all
                        hover:border-[var(--color-primary)]
                        hover:text-[var(--color-primary)]
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                  تصاویر و توضیحات
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
                  در این مرحله تصاویر و اطلاعات تکمیلی آگهی را
                  اضافه خواهید کرد.
                </p>

                <div className="mt-8 flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-gray-5)] bg-[var(--color-gray-2)]">
                  <div className="text-center">
                    <div className="text-sm font-bold text-[var(--color-gray-10)]">
                      آپلود تصاویر ملک
                    </div>

                    <p className="mt-2 text-xs text-[var(--color-gray-7)]">
                      در مرحله بعد امکان آپلود و مدیریت تصاویر
                      اضافه می‌شود.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-gray-13)]">
                  موقعیت ملک
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
                  موقعیت ملک را روی نقشه مشخص خواهید کرد.
                </p>

                <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-2xl border border-[var(--color-gray-4)] bg-[var(--color-gray-2)]">
                  <div className="text-center">
                    <FiHome
                      size={40}
                      className="mx-auto text-[var(--color-primary)]"
                    />

                    <p className="mt-4 text-sm font-bold text-[var(--color-gray-10)]">
                      انتخاب موقعیت روی نقشه
                    </p>

                    <p className="mt-2 text-xs text-[var(--color-gray-7)]">
                      نقشه و انتخاب موقعیت در مرحله بعدی
                      پیاده‌سازی می‌شود.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[var(--color-gray-4)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[var(--color-gray-4)]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-[var(--color-gray-10)]
                  transition-all
                  hover:border-[var(--color-primary)]
                  hover:text-[var(--color-primary)]
                  disabled:pointer-events-none
                  disabled:opacity-40
                "
              >
                <FiArrowRight size={17} />
                مرحله قبل
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue()}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition-all
                  hover:-translate-y-0.5
                  hover:opacity-90
                  disabled:pointer-events-none
                  disabled:opacity-40
                "
              >
                {currentStep === steps.length
                  ? "پیش‌نمایش آگهی"
                  : "مرحله بعد"}

                <FiArrowLeft size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}