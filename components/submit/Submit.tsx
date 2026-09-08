
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  ChangeEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiHome,
  FiKey,
  FiMapPin,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";

const SubmitMap = dynamic(
  () => import("./SubmitMap"),
  {
    ssr: false,
  },
);

type TransactionType =
  | "فروش"
  | "اجاره"
  | null;

type PropertyType =
  | "آپارتمان"
  | "خانه"
  | "ویلا"
  | "زمین"
  | "تجاری"
  | null;

type ImageItem = {
  id: string;
  file: File;
  preview: string;
};

type FormData = {
  transactionType: TransactionType;
  propertyType: PropertyType;

  area: string;
  bedrooms: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;

  salePrice: string;
  deposit: string;
  rent: string;

  amenities: string[];

  title: string;
  description: string;

  city: string;
  district: string;

  latitude: number | null;
  longitude: number | null;
};

type FormErrors = Partial<
  Record<
    | "transactionType"
    | "propertyType"
    | "area"
    | "bedrooms"
    | "floor"
    | "totalFloors"
    | "yearBuilt"
    | "salePrice"
    | "deposit"
    | "rent"
    | "title"
    | "description"
    | "city"
    | "district"
    | "location",
    string
  >
>;

const steps = [
  "نوع آگهی",
  "مشخصات ملک",
  "قیمت",
  "امکانات",
  "تصاویر",
  "موقعیت",
  "پیش‌نمایش",
];

const propertyTypes = [
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
] as const;

const amenities = [
  "پارکینگ",
  "آسانسور",
  "انباری",
  "بالکن",
  "استخر",
  "سونا",
  "جکوزی",
  "نگهبانی",
  "لابی",
];

const initialFormData: FormData = {
  transactionType: null,
  propertyType: null,

  area: "",
  bedrooms: "",
  floor: "",
  totalFloors: "",
  yearBuilt: "",

  salePrice: "",
  deposit: "",
  rent: "",

  amenities: [],

  title: "",
  description: "",

  city: "",
  district: "",

  latitude: null,
  longitude: null,
};

const persianDigits = [
  "۰",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
];

function toPersianDigits(value: string) {
  return value.replace(
    /\d/g,
    (digit) =>
      persianDigits[Number(digit)],
  );
}

function normalizeDigits(value: string) {
  return value
    .replace(
      /[۰-۹]/g,
      (digit) =>
        String(
          "۰۱۲۳۴۵۶۷۸۹".indexOf(
            digit,
          ),
        ),
    )
    .replace(/[٬,./]/g, "")
    .replace(/\D/g, "");
}

function formatNumber(value: string) {
  const normalized =
    normalizeDigits(value);

  if (!normalized) {
    return "";
  }

  return normalized.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
}

/**
 * 12,540,000,000
 * =>
 * ۱۲ میلیارد و ۵۴۰ میلیون تومان
 *
 * هیچ گرد کردنی انجام نمی‌شود.
 */
function numberToExactText(value: string) {
  const normalized =
    normalizeDigits(value);

  if (!normalized) {
    return "";
  }

  const groups: {
    value: string;
    label: string;
  }[] = [];

  const padded =
    normalized.padStart(
      Math.ceil(normalized.length / 3) *
        3,
      "0",
    );

  const chunks =
    padded.match(/.{1,3}/g) ?? [];

  const unitLabels = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
    "هزار تریلیون",
  ];

  chunks.forEach(
    (chunk, index) => {
      const numeric =
        Number(chunk);

      if (!numeric) {
        return;
      }

      const power =
        chunks.length -
        index -
        1;

      groups.push({
        value: toPersianDigits(
          String(numeric),
        ),
        label:
          unitLabels[power] ?? "",
      });
    },
  );

  if (!groups.length) {
    return "۰ تومان";
  }

  return `${groups
    .map((group) =>
      group.label
        ? `${group.value} ${group.label}`
        : group.value,
    )
    .join(" و ")} تومان`;
}

function parseNumericValue(value: string) {
  return Number(
    normalizeDigits(value) || "0",
  );
}

export default function Submit() {
  const router = useRouter();

  const [currentStep, setCurrentStep] =
    useState(0);

  const [formData, setFormData] =
    useState<FormData>(
      initialFormData,
    );

  const [images, setImages] =
    useState<ImageItem[]>([]);

  const [
    mainImageId,
    setMainImageId,
  ] = useState<string | null>(
    null,
  );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const progress =
    ((currentStep + 1) /
      steps.length) *
    100;

  const mainImage =
    useMemo(() => {
      if (!images.length) {
        return null;
      }

      if (!mainImageId) {
        return images[0];
      }

      return (
        images.find(
          (image) =>
            image.id ===
            mainImageId,
        ) ?? images[0]
      );
    }, [
      images,
      mainImageId,
    ]);

  function updateField<
    K extends keyof FormData,
  >(
    field: K,
    value: FormData[K],
  ) {
    setFormData(
      (previous) => ({
        ...previous,
        [field]: value,
      }),
    );

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      delete next[
        field as keyof FormErrors
      ];

      return next;
    });
  }

  function handleTextChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    field: keyof FormData,
  ) {
    updateField(
      field,
      event.target.value as never,
    );
  }

  function handlePriceChange(
    event: ChangeEvent<HTMLInputElement>,
    field:
      | "salePrice"
      | "deposit"
      | "rent",
  ) {
    updateField(
      field,
      formatNumber(
        event.target.value,
      ),
    );
  }

  function toggleAmenity(
    amenity: string,
  ) {
    setFormData((previous) => ({
      ...previous,

      amenities:
        previous.amenities.includes(
          amenity,
        )
          ? previous.amenities.filter(
              (item) =>
                item !== amenity,
            )
          : [
              ...previous.amenities,
              amenity,
            ],
    }));
  }

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selected =
      Array.from(
        event.target.files ??
          [],
      );

    if (!selected.length) {
      return;
    }

    const freeSlots =
      10 - images.length;

    const validFiles =
      selected
        .filter(
          (file) =>
            file.type.startsWith(
              "image/",
            ) &&
            file.size <=
              5 *
                1024 *
                1024,
        )
        .slice(0, freeSlots);

    const newImages =
      validFiles.map(
        (file) => ({
          id: `${Date.now()}-${Math.random()}-${file.name}`,

          file,

          preview:
            URL.createObjectURL(
              file,
            ),
        }),
      );

    setImages((previous) => [
      ...previous,
      ...newImages,
    ]);

    if (
      !mainImageId &&
      newImages[0]
    ) {
      setMainImageId(
        newImages[0].id,
      );
    }

    event.target.value = "";
  }

  function removeImage(
    id: string,
  ) {
    const target =
      images.find(
        (image) =>
          image.id === id,
      );

    if (target) {
      URL.revokeObjectURL(
        target.preview,
      );
    }

    const remaining =
      images.filter(
        (image) =>
          image.id !== id,
      );

    setImages(remaining);

    if (mainImageId === id) {
      setMainImageId(
        remaining[0]?.id ??
          null,
      );
    }
  }

  function validateStep(
    step: number,
  ) {
    const nextErrors: FormErrors =
      {};

    if (step === 0) {
      if (
        !formData.transactionType
      ) {
        nextErrors.transactionType =
          "نوع آگهی را انتخاب کنید.";
      }

      if (
        !formData.propertyType
      ) {
        nextErrors.propertyType =
          "نوع ملک را انتخاب کنید.";
      }
    }

    if (step === 1) {
      if (
        parseNumericValue(
          formData.area,
        ) <= 0
      ) {
        nextErrors.area =
          "متراژ را وارد کنید.";
      }

      if (
        formData.bedrooms === ""
      ) {
        nextErrors.bedrooms =
          "تعداد اتاق را وارد کنید.";
      }

      if (
        formData.floor === ""
      ) {
        nextErrors.floor =
          "طبقه را وارد کنید.";
      }

      if (
        parseNumericValue(
          formData.totalFloors,
        ) <= 0
      ) {
        nextErrors.totalFloors =
          "تعداد کل طبقات را وارد کنید.";
      }

      const year =
        parseNumericValue(
          formData.yearBuilt,
        );

      if (
        year < 1300 ||
        year > 1405
      ) {
        nextErrors.yearBuilt =
          "سال ساخت معتبر وارد کنید.";
      }
    }

    if (step === 2) {
      if (
        formData.transactionType ===
          "فروش" &&
        parseNumericValue(
          formData.salePrice,
        ) <= 0
      ) {
        nextErrors.salePrice =
          "قیمت فروش را وارد کنید.";
      }

      if (
        formData.transactionType ===
        "اجاره"
      ) {
        if (
          formData.deposit ===
          ""
        ) {
          nextErrors.deposit =
            "ودیعه را وارد کنید.";
        }

        if (
          formData.rent === ""
        ) {
          nextErrors.rent =
            "اجاره ماهانه را وارد کنید.";
        }
      }
    }

    if (step === 4) {
      if (
        !formData.title.trim()
      ) {
        nextErrors.title =
          "عنوان آگهی را وارد کنید.";
      }

      if (
        formData.description
          .trim().length < 20
      ) {
        nextErrors.description =
          "توضیحات حداقل باید ۲۰ کاراکتر باشد.";
      }
    }

    if (step === 5) {
      if (
        !formData.city.trim()
      ) {
        nextErrors.city =
          "شهر را وارد کنید.";
      }

      if (
        !formData.district.trim()
      ) {
        nextErrors.district =
          "محله را وارد کنید.";
      }

      if (
        formData.latitude ===
          null ||
        formData.longitude ===
          null
      ) {
        nextErrors.location =
          "موقعیت را روی نقشه انتخاب کنید.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  }

  function handleNext() {
    if (
      !validateStep(
        currentStep,
      )
    ) {
      return;
    }

    setCurrentStep(
      (previous) =>
        Math.min(
          previous + 1,
          steps.length - 1,
        ),
    );
  }

  function handlePrevious() {
    setCurrentStep(
      (previous) =>
        Math.max(
          previous - 1,
          0,
        ),
    );
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const stepsToValidate = [
      0,
      1,
      2,
      4,
      5,
    ];

    for (const step of stepsToValidate) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    if (
      !formData.transactionType ||
      !formData.propertyType ||
      formData.latitude === null ||
      formData.longitude === null
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "/api/properties",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transactionType:
              formData.transactionType ===
              "فروش"
                ? "buy"
                : "rent",

            propertyType:
              formData.propertyType ===
              "آپارتمان"
                ? "apartment"
                : formData.propertyType ===
                    "خانه"
                  ? "house"
                  : formData.propertyType ===
                      "ویلا"
                    ? "villa"
                    : formData.propertyType ===
                        "زمین"
                      ? "land"
                      : "commercial",

            title:
              formData.title.trim(),

            description:
              formData.description.trim(),

            area:
              parseNumericValue(
                formData.area,
              ),

            bedrooms:
              parseNumericValue(
                formData.bedrooms,
              ),

            floor:
              parseNumericValue(
                formData.floor,
              ),

            totalFloors:
              parseNumericValue(
                formData.totalFloors,
              ),

            yearBuilt:
              parseNumericValue(
                formData.yearBuilt,
              ),

            salePrice:
              parseNumericValue(
                formData.salePrice,
              ),

            deposit:
              parseNumericValue(
                formData.deposit,
              ),

            rent:
              parseNumericValue(
                formData.rent,
              ),

            amenities:
              formData.amenities,

            city:
              formData.city.trim(),

            district:
              formData.district.trim(),

            latitude:
              formData.latitude,

            longitude:
              formData.longitude,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        setSubmitError(
          data.message ||
            "ثبت آگهی انجام نشد.",
        );

        return;
      }

      router.push("/profile/ads");
    } catch (error) {
      console.error(
        "Submit property error:",
        error,
      );

      setSubmitError(
        "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="bg-white"
    >
      <section className="mx-auto w-full max-w-[1224px] px-4 pb-16 pt-24 md:px-6 md:pt-24 lg:px-0 lg:pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-gray-13)] md:text-3xl">
            ثبت آگهی ملک
          </h1>

          <p className="mt-2 text-sm text-[var(--color-gray-8)]">
            اطلاعات ملک خود را
            مرحله‌به‌مرحله تکمیل کنید.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 rounded-2xl border border-[var(--color-gray-4)] p-4 md:p-6">
          <div className="mb-4 flex justify-between">
            <span className="text-sm font-bold">
              مرحله{" "}
              {currentStep + 1} از{" "}
              {steps.length}
            </span>

            <span className="text-sm font-bold text-[var(--color-primary)]">
              {Math.round(
                progress,
              )}
              ٪
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-gray-3)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-4 text-center text-sm font-bold text-[var(--color-gray-10)]">
            {
              steps[
                currentStep
              ]
            }
          </p>
        </div>

        {/* CURRENT SELECTIONS */}
        {(formData.transactionType ||
          formData.propertyType ||
          formData.area) && (
          <div className="mb-6 rounded-2xl border border-[var(--color-gray-4)] bg-[var(--color-gray-2)] p-4">
            <p className="mb-3 text-xs font-bold text-[var(--color-gray-7)]">
              اطلاعات انتخاب‌شده
            </p>

            <div className="flex flex-wrap gap-2">
              {formData.transactionType && (
                <SelectionChip
                  label="نوع آگهی"
                  value={
                    formData.transactionType
                  }
                />
              )}

              {formData.propertyType && (
                <SelectionChip
                  label="نوع ملک"
                  value={
                    formData.propertyType
                  }
                />
              )}

              {formData.area && (
                <SelectionChip
                  label="متراژ"
                  value={`${formData.area} متر`}
                />
              )}

              {formData.bedrooms !==
                "" && (
                <SelectionChip
                  label="اتاق"
                  value={
                    formData.bedrooms
                  }
                />
              )}

              {formData.yearBuilt && (
                <SelectionChip
                  label="سال ساخت"
                  value={
                    formData.yearBuilt
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-[var(--color-gray-4)] bg-white p-5 shadow-sm md:p-8">
          {/* STEP 1 */}
          {currentStep === 0 && (
            <>
              <SectionTitle
                title="نوع آگهی"
                description="مشخص کنید ملک برای فروش است یا اجاره."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <ChoiceCard
                  selected={
                    formData.transactionType ===
                    "فروش"
                  }
                  title="فروش"
                  description="ثبت ملک برای فروش"
                  icon={
                    <FiKey />
                  }
                  onClick={() =>
                    updateField(
                      "transactionType",
                      "فروش",
                    )
                  }
                />

                <ChoiceCard
                  selected={
                    formData.transactionType ===
                    "اجاره"
                  }
                  title="اجاره"
                  description="رهن و اجاره ملک"
                  icon={
                    <FiHome />
                  }
                  onClick={() =>
                    updateField(
                      "transactionType",
                      "اجاره",
                    )
                  }
                />
              </div>

              <ErrorText
                text={
                  errors.transactionType
                }
              />

              <h3 className="mb-4 mt-8 font-bold">
                نوع ملک
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {propertyTypes.map(
                  (item) => (
                    <ChoiceCard
                      key={
                        item.title
                      }
                      selected={
                        formData.propertyType ===
                        item.title
                      }
                      title={
                        item.title
                      }
                      description={
                        item.description
                      }
                      onClick={() =>
                        updateField(
                          "propertyType",
                          item.title,
                        )
                      }
                    />
                  ),
                )}
              </div>

              <ErrorText
                text={
                  errors.propertyType
                }
              />
            </>
          )}

          {/* STEP 2 */}
          {currentStep === 1 && (
            <>
              <SectionTitle
                title="مشخصات ملک"
                description="اطلاعات اصلی ملک را وارد کنید."
              />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="متراژ"
                  error={
                    errors.area
                  }
                >
                  <input
                    value={
                      formData.area
                    }
                    inputMode="numeric"
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "area",
                        formatNumber(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="120"
                  />
                </Field>

                <Field
                  label="اتاق خواب"
                  error={
                    errors.bedrooms
                  }
                >
                  <input
                    value={
                      formData.bedrooms
                    }
                    inputMode="numeric"
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "bedrooms",
                        normalizeDigits(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="2"
                  />
                </Field>

                <Field
                  label="طبقه"
                  error={
                    errors.floor
                  }
                >
                  <input
                    value={
                      formData.floor
                    }
                    inputMode="numeric"
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "floor",
                        normalizeDigits(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="3"
                  />
                </Field>

                <Field
                  label="کل طبقات"
                  error={
                    errors.totalFloors
                  }
                >
                  <input
                    value={
                      formData.totalFloors
                    }
                    inputMode="numeric"
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "totalFloors",
                        normalizeDigits(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="5"
                  />
                </Field>

                <Field
                  label="سال ساخت"
                  error={
                    errors.yearBuilt
                  }
                >
                  <input
                    value={
                      formData.yearBuilt
                    }
                    inputMode="numeric"
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "yearBuilt",
                        normalizeDigits(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="1400"
                  />
                </Field>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {currentStep === 2 && (
            <>
              <SectionTitle
                title="قیمت"
                description="مبلغ را به تومان وارد کنید. مبلغ دقیق به حروف همزمان نمایش داده می‌شود."
              />

              {formData.transactionType ===
                "فروش" && (
                <PriceField
                  label="قیمت فروش"
                  value={
                    formData.salePrice
                  }
                  error={
                    errors.salePrice
                  }
                  onChange={(
                    event,
                  ) =>
                    handlePriceChange(
                      event,
                      "salePrice",
                    )
                  }
                />
              )}

              {formData.transactionType ===
                "اجاره" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <PriceField
                    label="مبلغ ودیعه"
                    value={
                      formData.deposit
                    }
                    error={
                      errors.deposit
                    }
                    onChange={(
                      event,
                    ) =>
                      handlePriceChange(
                        event,
                        "deposit",
                      )
                    }
                  />

                  <PriceField
                    label="اجاره ماهانه"
                    value={
                      formData.rent
                    }
                    error={
                      errors.rent
                    }
                    onChange={(
                      event,
                    ) =>
                      handlePriceChange(
                        event,
                        "rent",
                      )
                    }
                  />
                </div>
              )}
            </>
          )}

          {/* STEP 4 */}
          {currentStep === 3 && (
            <>
              <SectionTitle
                title="امکانات"
                description="امکانات موجود در ملک را انتخاب کنید."
              />

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {amenities.map(
                  (amenity) => {
                    const selected =
                      formData.amenities.includes(
                        amenity,
                      );

                    return (
                      <button
                        key={
                          amenity
                        }
                        type="button"
                        onClick={() =>
                          toggleAmenity(
                            amenity,
                          )
                        }
                        className={`flex items-center justify-between rounded-xl border p-4 ${
                          selected
                            ? "border-[var(--color-primary)] bg-red-50"
                            : "border-[var(--color-gray-4)]"
                        }`}
                      >
                        <span className="font-bold">
                          {
                            amenity
                          }
                        </span>

                        {selected && (
                          <FiCheck className="text-[var(--color-primary)]" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {formData.amenities
                .length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {formData.amenities.map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-[var(--color-primary)]"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              )}
            </>
          )}

          {/* STEP 5 */}
          {currentStep === 4 && (
            <>
              <SectionTitle
                title="تصاویر و توضیحات"
                description="تصویر اختیاری است. اگر تصویری قرار ندهید تصویر پیش‌فرض سقفینو نمایش داده می‌شود."
              />

              <div className="space-y-6">
                <Field
                  label="عنوان آگهی"
                  error={
                    errors.title
                  }
                >
                  <input
                    value={
                      formData.title
                    }
                    onChange={(
                      event,
                    ) =>
                      handleTextChange(
                        event,
                        "title",
                      )
                    }
                    className={inputClass}
                    placeholder="آپارتمان دو خوابه در سعادت‌آباد"
                  />
                </Field>

                <Field
                  label="توضیحات"
                  error={
                    errors.description
                  }
                >
                  <textarea
                    rows={7}
                    value={
                      formData.description
                    }
                    onChange={(
                      event,
                    ) =>
                      handleTextChange(
                        event,
                        "description",
                      )
                    }
                    className={`${inputClass} h-auto py-4`}
                  />
                </Field>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold">
                        تصاویر
                      </p>

                      <p className="mt-1 text-xs text-[var(--color-gray-7)]">
                        اختیاری — حداکثر
                        ۱۰ تصویر
                      </p>
                    </div>

                    <span className="text-sm font-bold">
                      {
                        images.length
                      }{" "}
                      / 10
                    </span>
                  </div>

                  {images.length <
                    10 && (
                    <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-gray-5)]">
                      <FiUploadCloud
                        size={30}
                        className="text-[var(--color-primary)]"
                      />

                      <span className="mt-3 font-bold">
                        انتخاب تصویر
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={
                          handleImageUpload
                        }
                      />
                    </label>
                  )}

                  {!images.length && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-bold text-[var(--color-gray-7)]">
                        تصویر پیش‌فرض آگهی
                      </p>

                      <div className="relative h-[180px] max-w-[320px] overflow-hidden rounded-2xl border">
                        <Image
                          src="/images/default.png"
                          alt="تصویر پیش‌فرض"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {images.length >
                    0 && (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                      {images.map(
                        (image) => (
                          <div
                            key={
                              image.id
                            }
                            className={`relative overflow-hidden rounded-2xl border-2 ${
                              image.id ===
                              mainImageId
                                ? "border-[var(--color-primary)]"
                                : "border-transparent"
                            }`}
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={
                                  image.preview
                                }
                                alt="ملک"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>

                            <div className="flex gap-2 p-2">
                              {image.id !==
                                mainImageId && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMainImageId(
                                      image.id,
                                    )
                                  }
                                  className="flex-1 rounded-lg bg-[var(--color-gray-3)] p-2 text-xs font-bold"
                                >
                                  تصویر اصلی
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  removeImage(
                                    image.id,
                                  )
                                }
                                className="rounded-lg bg-red-600 p-2 text-white"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* STEP 6 */}
          {currentStep === 5 && (
            <>
              <SectionTitle
                title="موقعیت"
                description="شهر، محله و موقعیت ملک را مشخص کنید."
              />

              <div className="mb-6 grid gap-5 md:grid-cols-2">
                <Field
                  label="شهر"
                  error={
                    errors.city
                  }
                >
                  <input
                    value={
                      formData.city
                    }
                    onChange={(
                      event,
                    ) =>
                      handleTextChange(
                        event,
                        "city",
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="محله"
                  error={
                    errors.district
                  }
                >
                  <input
                    value={
                      formData.district
                    }
                    onChange={(
                      event,
                    ) =>
                      handleTextChange(
                        event,
                        "district",
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <SubmitMap
                position={
                  formData.latitude !==
                    null &&
                  formData.longitude !==
                    null
                    ? [
                        formData.latitude,
                        formData.longitude,
                      ]
                    : null
                }
                onPositionChange={(
                  position,
                ) => {
                  updateField(
                    "latitude",
                    position[0],
                  );

                  updateField(
                    "longitude",
                    position[1],
                  );
                }}
              />

              <ErrorText
                text={
                  errors.location
                }
              />
            </>
          )}

          {/* STEP 7 */}
          {currentStep === 6 && (
            <>
              <SectionTitle
                title="پیش‌نمایش نهایی"
                description="اطلاعات آگهی را قبل از ثبت بررسی کنید."
              />

              <div className="overflow-hidden rounded-2xl border border-[var(--color-gray-4)]">
                <div className="relative aspect-[16/8]">
                  <Image
                    src={
                      mainImage?.preview ??
                      "/images/default.png"
                    }
                    alt={
                      formData.title
                    }
                    fill
                    unoptimized={
                      !!mainImage
                    }
                    className="object-cover"
                  />
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex flex-wrap gap-2">
                    <SelectionChip
                      label="نوع آگهی"
                      value={
                        formData.transactionType ??
                        "-"
                      }
                    />

                    <SelectionChip
                      label="نوع ملک"
                      value={
                        formData.propertyType ??
                        "-"
                      }
                    />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    {
                      formData.title
                    }
                  </h2>

                  <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-gray-8)]">
                    <FiMapPin />

                    {formData.city}،{" "}
                    {
                      formData.district
                    }
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                    <PreviewBox
                      label="متراژ"
                      value={`${formData.area} متر`}
                    />

                    <PreviewBox
                      label="اتاق"
                      value={
                        formData.bedrooms
                      }
                    />

                    <PreviewBox
                      label="طبقه"
                      value={
                        formData.floor
                      }
                    />

                    <PreviewBox
                      label="کل طبقات"
                      value={
                        formData.totalFloors
                      }
                    />

                    <PreviewBox
                      label="سال ساخت"
                      value={
                        formData.yearBuilt
                      }
                    />
                  </div>

                  <div className="mt-6 rounded-2xl bg-red-50 p-5">
                    {formData.transactionType ===
                    "فروش" ? (
                      <>
                        <p className="text-xl font-bold text-[var(--color-primary)]">
                          {
                            formData.salePrice
                          }{" "}
                          تومان
                        </p>

                        <p className="mt-2 text-sm font-bold">
                          {numberToExactText(
                            formData.salePrice,
                          )}
                        </p>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold text-[var(--color-primary)]">
                            ودیعه:{" "}
                            {
                              formData.deposit
                            }{" "}
                            تومان
                          </p>

                          <p className="mt-1 text-sm">
                            {numberToExactText(
                              formData.deposit,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-[var(--color-primary)]">
                            اجاره:{" "}
                            {
                              formData.rent
                            }{" "}
                            تومان
                          </p>

                          <p className="mt-1 text-sm">
                            {numberToExactText(
                              formData.rent,
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {formData.amenities
                    .length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {formData.amenities.map(
                        (item) => (
                          <span
                            key={
                              item
                            }
                            className="rounded-lg bg-[var(--color-gray-3)] px-3 py-2 text-xs font-bold"
                          >
                            {
                              item
                            }
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  <p className="mt-6 whitespace-pre-line leading-8 text-[var(--color-gray-8)]">
                    {
                      formData.description
                    }
                  </p>
                </div>
              </div>
            </>
          )}

          {/* SUBMIT ERROR */}
          {submitError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {submitError}
            </div>
          )}

          {/* NAV */}
          <div className="mt-8 flex justify-between border-t pt-6">
            <button
              type="button"
              disabled={
                currentStep === 0 ||
                isSubmitting
              }
              onClick={
                handlePrevious
              }
              className="flex h-12 items-center gap-2 rounded-xl border px-5 font-bold disabled:opacity-40"
            >
              <FiArrowRight />
              قبلی
            </button>

            {currentStep <
            steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex h-12 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 font-bold text-white"
              >
                بعدی
                <FiArrowLeft />
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  isSubmitting
                }
                className="flex h-12 items-center gap-2 rounded-xl bg-green-600 px-6 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiCheck />

                {isSubmitting
                  ? "در حال ثبت..."
                  : "ثبت نهایی آگهی"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-[var(--color-gray-4)] bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)]";

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-7 text-[var(--color-gray-8)]">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold">
        {label}
      </label>

      {children}

      <ErrorText text={error} />
    </div>
  );
}

function ErrorText({
  text,
}: {
  text?: string;
}) {
  if (!text) {
    return null;
  }

  return (
    <p className="mt-2 text-xs font-bold text-red-600">
      {text}
    </p>
  );
}

function ChoiceCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-right transition ${
        selected
          ? "border-[var(--color-primary)] bg-red-50"
          : "border-[var(--color-gray-4)]"
      }`}
    >
      {icon && (
        <div className="mb-3 text-xl text-[var(--color-primary)]">
          {icon}
        </div>
      )}

      <p className="font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-[var(--color-gray-7)]">
        {description}
      </p>

      {selected && (
        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
          <FiCheck />
          انتخاب شده
        </div>
      )}
    </button>
  );
}

function SelectionChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-gray-4)] bg-white px-3 py-2 text-xs">
      <span className="text-[var(--color-gray-7)]">
        {label}:{" "}
      </span>

      <span className="font-bold">
        {value}
      </span>
    </div>
  );
}

function PriceField({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <Field
      label={label}
      error={error}
    >
      <input
        type="text"
        inputMode="numeric"
        dir="ltr"
        value={value}
        onChange={onChange}
        placeholder="12,540,000,000"
        className={`${inputClass} text-right`}
      />

      {value && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm font-bold text-[var(--color-primary)]">
            {numberToExactText(
              value,
            )}
          </p>
        </div>
      )}
    </Field>
  );
}

function PreviewBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--color-gray-2)] p-3 text-center">
      <p className="text-xs text-[var(--color-gray-7)]">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}

