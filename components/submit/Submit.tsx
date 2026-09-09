"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiHome,
  FiImage,
  FiKey,
  FiMapPin,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";

const SubmitMap = dynamic(() => import("./SubmitMap"), {
  ssr: false,
});

type TransactionType = "فروش" | "اجاره" | null;

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

  latitude: number;
  longitude: number;
};

type FormErrors = {
  transactionType?: string;
  propertyType?: string;

  area?: string;
  bedrooms?: string;
  floor?: string;
  totalFloors?: string;
  yearBuilt?: string;

  salePrice?: string;
  deposit?: string;
  rent?: string;

  title?: string;
  description?: string;

  city?: string;
  district?: string;
  location?: string;
};

const steps = [
  "نوع آگهی",
  "مشخصات ملک",
  "قیمت",
  "امکانات",
  "تصاویر",
  "موقعیت",
  "پیش‌نمایش",
];

const propertyTypes: {
  title: Exclude<PropertyType, null>;
  icon: ReactNode;
}[] = [
  {
    title: "آپارتمان",
    icon: <FiHome size={22} />,
  },
  {
    title: "خانه",
    icon: <FiHome size={22} />,
  },
  {
    title: "ویلا",
    icon: <FiHome size={22} />,
  },
  {
    title: "زمین",
    icon: <FiMapPin size={22} />,
  },
  {
    title: "تجاری",
    icon: <FiKey size={22} />,
  },
];

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

  latitude: 35.7219,
  longitude: 51.3347,
};

function toPersianDigits(value: string | number) {
  return String(value).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]
  );
}

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

function cleanNumber(value: string) {
  return normalizeDigits(value).replace(/[^\d]/g, "");
}

function formatNumber(value: string | number) {
  const normalized = cleanNumber(String(value));

  if (!normalized) {
    return "";
  }

  return Number(normalized).toLocaleString("en-US");
}

function formatPersianNumber(value: string | number) {
  const formatted = formatNumber(value);

  if (!formatted) {
    return "";
  }

  return toPersianDigits(formatted);
}

function numberToExactText(value: string) {
  const normalized = cleanNumber(value);

  if (!normalized) {
    return "";
  }

  const number = Number(normalized);

  if (!Number.isFinite(number)) {
    return "";
  }

  const units = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
  ];

  let amount = number;
  let unitIndex = 0;

  while (amount >= 1000 && unitIndex < units.length - 1) {
    amount /= 1000;
    unitIndex += 1;
  }

  const rounded =
    amount % 1 === 0
      ? amount.toLocaleString("fa-IR")
      : amount.toLocaleString("fa-IR", {
          maximumFractionDigits: 2,
        });

  if (unitIndex === 0) {
    return toPersianDigits(
      number.toLocaleString("en-US")
    );
  }

  return `${rounded} ${units[unitIndex]}`;
}

function getTransactionLabel(
  transactionType: TransactionType
) {
  if (transactionType === "فروش") {
    return "فروش";
  }

  if (transactionType === "اجاره") {
    return "اجاره";
  }

  return "انتخاب نشده";
}

function getPropertyLabel(propertyType: PropertyType) {
  return propertyType || "انتخاب نشده";
}

export default function Submit() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [images, setImages] = useState<ImageItem[]>([]);

  const [mainImageId, setMainImageId] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  /*
   * وقتی کامپوننت unmount شود، object URL های تصاویر
   * آزاد می‌شوند تا memory leak ایجاد نشود.
   */
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  const selectedMainImage = useMemo(() => {
    if (mainImageId) {
      const selected = images.find(
        (image) => image.id === mainImageId
      );

      if (selected) {
        return selected;
      }
    }

    return images[0] ?? null;
  }, [images, mainImageId]);

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));

    setSubmitError("");
  };

  const handleNumberChange =
    (key: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = cleanNumber(event.target.value);

      updateFormData(key, value);
    };

  const validateStep = (step: number) => {
    const nextErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.transactionType) {
        nextErrors.transactionType =
          "لطفاً نوع آگهی را انتخاب کنید.";
      }

      if (!formData.propertyType) {
        nextErrors.propertyType =
          "لطفاً نوع ملک را انتخاب کنید.";
      }
    }

    if (step === 1) {
      if (!formData.area) {
        nextErrors.area = "متراژ را وارد کنید.";
      } else if (Number(formData.area) <= 0) {
        nextErrors.area =
          "متراژ باید بیشتر از صفر باشد.";
      }

      if (!formData.bedrooms) {
        nextErrors.bedrooms =
          "تعداد اتاق خواب را وارد کنید.";
      }

      if (
        formData.floor &&
        formData.totalFloors &&
        Number(formData.floor) >
          Number(formData.totalFloors)
      ) {
        nextErrors.floor =
          "طبقه نمی‌تواند بیشتر از تعداد طبقات ساختمان باشد.";
      }
    }

    if (step === 2) {
      if (formData.transactionType === "فروش") {
        if (!formData.salePrice) {
          nextErrors.salePrice =
            "قیمت فروش را وارد کنید.";
        }
      }

      if (formData.transactionType === "اجاره") {
        if (!formData.deposit) {
          nextErrors.deposit =
            "مبلغ ودیعه را وارد کنید.";
        }

        if (!formData.rent) {
          nextErrors.rent =
            "مبلغ اجاره ماهانه را وارد کنید.";
        }
      }
    }

    if (step === 4) {
      if (!formData.title.trim()) {
        nextErrors.title =
          "عنوان آگهی را وارد کنید.";
      }

      if (!formData.description.trim()) {
        nextErrors.description =
          "توضیحات آگهی را وارد کنید.";
      }
    }

    if (step === 5) {
      if (!formData.city.trim()) {
        nextErrors.city =
          "لطفاً شهر را وارد کنید.";
      }

      if (!formData.district.trim()) {
        nextErrors.district =
          "لطفاً منطقه یا محله را وارد کنید.";
      }

      if (
        !Number.isFinite(formData.latitude) ||
        !Number.isFinite(formData.longitude)
      ) {
        nextErrors.location =
          "لطفاً موقعیت ملک را روی نقشه مشخص کنید.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((previous) =>
      Math.min(previous + 1, steps.length - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStepClick = (index: number) => {
    if (index >= currentStep) {
      return;
    }

    setCurrentStep(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const availableSlots = 10 - images.length;

    const selectedFiles = files
      .slice(0, availableSlots)
      .filter((file) => {
        const validType = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type);

        const validSize =
          file.size <= 5 * 1024 * 1024;

        return validType && validSize;
      });

    const newImages: ImageItem[] =
      selectedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      }));

    if (!newImages.length) {
      event.target.value = "";
      return;
    }

    setImages((previous) => {
      const updated = [...previous, ...newImages];

      if (!mainImageId && updated.length > 0) {
        setMainImageId(updated[0].id);
      }

      return updated;
    });

    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setImages((previous) => {
      const imageToRemove = previous.find(
        (image) => image.id === id
      );

      if (imageToRemove) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      const updated = previous.filter(
        (image) => image.id !== id
      );

      if (id === mainImageId) {
        setMainImageId(
          updated[0]?.id ?? null
        );
      }

      return updated;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.amenities.includes(amenity);

      return {
        ...previous,
        amenities: alreadySelected
          ? previous.amenities.filter(
              (item) => item !== amenity
            )
          : [...previous.amenities, amenity],
      };
    });
  };

  const handleSubmit = async () => {
    setSubmitError("");

    for (let step = 0; step <= 5; step += 1) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const uploadedImages: string[] = [];

      const orderedImages = [
        ...images.filter(
          (image) => image.id === mainImageId
        ),
        ...images.filter(
          (image) => image.id !== mainImageId
        ),
      ];

      /*
       * آپلود تصاویر به ترتیب.
       * تصویر اصلی همیشه اولین تصویر ارسالی خواهد بود.
       */
      for (const image of orderedImages) {
        const uploadData = new FormData();

        uploadData.append("file", image.file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        /*
         * پاسخ را ابتدا به صورت text می‌خوانیم
         * تا در صورت خالی بودن response با
         * Unexpected end of JSON input مواجه نشویم.
         */
        const responseText = await response.text();

        let result: {
          success?: boolean;
          message?: string;
          image?: {
            url?: string;
            publicId?: string;
          };
        } = {};

        if (responseText) {
          try {
            result = JSON.parse(responseText);
          } catch {
            throw new Error(
              "پاسخ نامعتبر از سرور هنگام آپلود تصویر دریافت شد."
            );
          }
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              `آپلود تصویر با خطا مواجه شد. (${response.status})`
          );
        }

        if (result.image?.url) {
          uploadedImages.push(result.image.url);
        } else {
          throw new Error(
            "آپلود تصویر انجام شد اما آدرس تصویر از سرور دریافت نشد."
          );
        }
      }

      /*
       * ثبت اطلاعات ملک
       */
      const propertyResponse = await fetch(
        "/api/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionType:
              formData.transactionType === "فروش"
                ? "buy"
                : "rent",

            propertyType:
              formData.propertyType === "آپارتمان"
                ? "apartment"
                : formData.propertyType === "خانه"
                ? "house"
                : formData.propertyType === "ویلا"
                ? "villa"
                : formData.propertyType === "زمین"
                ? "land"
                : "commercial",

            area: Number(formData.area),

            bedrooms: Number(
              formData.bedrooms
            ),

            floor: formData.floor
              ? Number(formData.floor)
              : undefined,

            totalFloors: formData.totalFloors
              ? Number(formData.totalFloors)
              : undefined,

            yearBuilt: formData.yearBuilt
              ? Number(formData.yearBuilt)
              : undefined,

            salePrice:
              formData.transactionType ===
                "فروش" &&
              formData.salePrice
                ? Number(formData.salePrice)
                : undefined,

            deposit:
              formData.transactionType ===
                "اجاره" &&
              formData.deposit
                ? Number(formData.deposit)
                : undefined,

            rent:
              formData.transactionType ===
                "اجاره" &&
              formData.rent
                ? Number(formData.rent)
                : undefined,

            amenities: formData.amenities,

            title: formData.title.trim(),

            description:
              formData.description.trim(),

            city: formData.city.trim(),

            district:
              formData.district.trim(),

            latitude: formData.latitude,

            longitude: formData.longitude,

            images: uploadedImages,
          }),
        }
      );

      /*
       * پاسخ API ثبت ملک را هم به صورت امن می‌خوانیم.
       */
      const propertyResponseText =
        await propertyResponse.text();

      let propertyResult: {
        success?: boolean;
        message?: string;
        property?: {
          id?: string;
          status?: string;
          title?: string;
          transactionType?: string;
          images?: string[];
        };
      } = {};

      if (propertyResponseText) {
        try {
          propertyResult = JSON.parse(
            propertyResponseText
          );
        } catch {
          throw new Error(
            "پاسخ نامعتبر از سرور هنگام ثبت آگهی دریافت شد."
          );
        }
      }

      if (
        !propertyResponse.ok ||
        !propertyResult.success
      ) {
        throw new Error(
          propertyResult.message ||
            `ثبت آگهی با خطا مواجه شد. (${propertyResponse.status})`
        );
      }

      router.push("/profile/ads");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "ثبت آگهی با خطا مواجه شد."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (error?: string) => {
    if (!error) {
      return null;
    }

    return (
      <p className="mt-2 text-xs font-medium text-[#CB1B1B]">
        {error}
      </p>
    );
  };

  /*
   * این قسمت مهم است:
   * خلاصه آگهی در تمام مراحل از formData خوانده می‌شود،
   * بنابراین با هر تغییر input بلافاصله آپدیت می‌شود.
   */
  const liveSummary = (
    <div className="rounded-2xl border border-gray-3 bg-white">
      <div className="border-b border-gray-3 px-5 py-4">
        <h3 className="font-bold text-gray-13">
          خلاصه آگهی
        </h3>

        <p className="mt-1 text-xs text-gray-7">
          اطلاعات انتخاب‌شده به صورت لحظه‌ای نمایش داده می‌شود.
        </p>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {formData.transactionType && (
            <span className="rounded-lg bg-[#CB1B1B] px-3 py-1.5 text-xs font-bold text-white">
              {formData.transactionType}
            </span>
          )}

          {formData.propertyType && (
            <span className="rounded-lg bg-gray-2 px-3 py-1.5 text-xs font-bold text-gray-11">
              {formData.propertyType}
            </span>
          )}
        </div>

        {!formData.transactionType &&
          !formData.propertyType && (
            <p className="text-sm text-gray-7">
              هنوز نوع آگهی یا ملک انتخاب نشده است.
            </p>
          )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <SummaryItem
            label="متراژ"
            value={
              formData.area
                ? `${formatPersianNumber(
                    formData.area
                  )} متر`
                : "—"
            }
          />

          <SummaryItem
            label="اتاق"
            value={
              formData.bedrooms
                ? `${toPersianDigits(
                    formData.bedrooms
                  )} خواب`
                : "—"
            }
          />

          <SummaryItem
            label="طبقه"
            value={
              formData.floor
                ? toPersianDigits(
                    formData.floor
                  )
                : "—"
            }
          />

          <SummaryItem
            label="سال ساخت"
            value={
              formData.yearBuilt
                ? toPersianDigits(
                    formData.yearBuilt
                  )
                : "—"
            }
          />
        </div>

        {formData.transactionType ===
          "فروش" &&
          formData.salePrice && (
            <div className="mt-3 rounded-xl bg-[#CB1B1B]/5 p-3">
              <p className="text-xs text-gray-7">
                قیمت فروش
              </p>

              <p className="mt-1 text-sm font-bold text-[#CB1B1B]">
                {formatPersianNumber(
                  formData.salePrice
                )}{" "}
                تومان
              </p>
            </div>
          )}

        {formData.transactionType ===
          "اجاره" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <SummaryItem
              label="ودیعه"
              value={
                formData.deposit
                  ? `${formatPersianNumber(
                      formData.deposit
                    )} تومان`
                  : "—"
              }
            />

            <SummaryItem
              label="اجاره"
              value={
                formData.rent
                  ? `${formatPersianNumber(
                      formData.rent
                    )} تومان`
                  : "—"
              }
            />
          </div>
        )}

        {(formData.city ||
          formData.district) && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-1 p-3">
            <FiMapPin
              size={16}
              className="mt-0.5 shrink-0 text-[#CB1B1B]"
            />

            <p className="text-xs leading-6 text-gray-8">
              {[
                formData.city,
                formData.district,
              ]
                .filter(Boolean)
                .join("، ")}
            </p>
          </div>
        )}

        {formData.amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-7">
              امکانات
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.amenities.map(
                (amenity) => (
                  <span
                    key={amenity}
                    className="rounded-md bg-gray-2 px-2 py-1 text-[11px] text-gray-9"
                  >
                    {amenity}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {formData.title && (
          <div className="mt-4 border-t border-gray-3 pt-4">
            <p className="text-xs text-gray-7">
              عنوان
            </p>

            <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-13">
              {formData.title}
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-4 border-t border-gray-3 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-7">
                تصاویر
              </p>

              <span className="text-xs font-bold text-gray-10">
                {toPersianDigits(images.length)} تصویر
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-1 pb-16"
    >
      <div className="mx-auto w-full max-w-[1224px] px-4 sm:px-5 md:px-6">
        {/* Page Header */}
        <div className="pt-6 sm:pt-8 md:pt-10">
          <h1 className="text-2xl font-bold text-gray-13 sm:text-3xl">
            ثبت آگهی
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-7 sm:text-base">
            اطلاعات ملک خود را وارد کنید تا آگهی شما
            در سقفینو ثبت شود.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-6 overflow-x-auto pb-2 sm:mt-8">
          <div className="flex min-w-max items-center justify-start gap-2 md:justify-center md:gap-3">
            {steps.map((step, index) => {
              const isActive =
                index === currentStep;

              const isCompleted =
                index < currentStep;

              return (
                <div
                  key={step}
                  className="flex items-center"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleStepClick(index)
                    }
                    disabled={
                      index >= currentStep
                    }
                    className={`flex items-center gap-2 whitespace-nowrap ${
                      index < currentStep
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition sm:h-9 sm:w-9 sm:text-sm ${
                        isActive
                          ? "bg-[#CB1B1B] text-white"
                          : isCompleted
                          ? "bg-[#CB1B1B]/10 text-[#CB1B1B]"
                          : "bg-gray-3 text-gray-7"
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck size={15} />
                      ) : (
                        toPersianDigits(
                          index + 1
                        )
                      )}
                    </span>

                    <span
                      className={`text-xs sm:text-sm ${
                        isActive
                          ? "font-bold text-gray-13"
                          : "text-gray-7"
                      }`}
                    >
                      {step}
                    </span>
                  </button>

                  {index <
                    steps.length - 1 && (
                    <span className="mx-2 h-px w-4 bg-gray-3 sm:mx-3 sm:w-7" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Live Summary */}
        <div className="mt-5 lg:hidden">
          {liveSummary}
        </div>

        {/* Content Layout */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start lg:gap-6">
          {/* Form */}
          <div className="min-w-0 rounded-2xl border border-gray-3 bg-white p-4 shadow-sm sm:p-6 md:p-8">
            {/* STEP 0 */}
            {currentStep === 0 && (
              <div>
                <div>
                  <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                    نوع آگهی
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-7">
                    ابتدا مشخص کنید قصد فروش یا اجاره
                    ملک را دارید.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      updateFormData(
                        "transactionType",
                        "فروش"
                      )
                    }
                    className={`rounded-xl border p-4 text-right transition sm:p-5 ${
                      formData.transactionType ===
                      "فروش"
                        ? "border-[#CB1B1B] bg-[#CB1B1B]/5"
                        : "border-gray-3 hover:border-gray-5"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                          formData.transactionType ===
                          "فروش"
                            ? "bg-[#CB1B1B] text-white"
                            : "bg-gray-2 text-gray-8"
                        }`}
                      >
                        <FiHome size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-13">
                          فروش
                        </h3>

                        <p className="mt-1 text-xs text-gray-7 sm:text-sm">
                          فروش ملک
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateFormData(
                        "transactionType",
                        "اجاره"
                      )
                    }
                    className={`rounded-xl border p-4 text-right transition sm:p-5 ${
                      formData.transactionType ===
                      "اجاره"
                        ? "border-[#CB1B1B] bg-[#CB1B1B]/5"
                        : "border-gray-3 hover:border-gray-5"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                          formData.transactionType ===
                          "اجاره"
                            ? "bg-[#CB1B1B] text-white"
                            : "bg-gray-2 text-gray-8"
                        }`}
                      >
                        <FiKey size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-13">
                          اجاره
                        </h3>

                        <p className="mt-1 text-xs text-gray-7 sm:text-sm">
                          اجاره ملک
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {renderError(
                  errors.transactionType
                )}

                <div className="mt-8 border-t border-gray-3 pt-7 sm:mt-10 sm:pt-8">
                  <h2 className="text-base font-bold text-gray-13 sm:text-lg">
                    نوع ملک
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
                    {propertyTypes.map(
                      (property) => {
                        const selected =
                          formData.propertyType ===
                          property.title;

                        return (
                          <button
                            key={
                              property.title
                            }
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "propertyType",
                                property.title
                              )
                            }
                            className={`flex min-h-[100px] flex-col items-center justify-center gap-2.5 rounded-xl border p-3 transition sm:min-h-[110px] ${
                              selected
                                ? "border-[#CB1B1B] bg-[#CB1B1B]/5 text-[#CB1B1B]"
                                : "border-gray-3 text-gray-8 hover:border-gray-5"
                            }`}
                          >
                            {property.icon}

                            <span className="text-xs font-medium sm:text-sm">
                              {
                                property.title
                              }
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {renderError(
                    errors.propertyType
                  )}
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                  مشخصات ملک
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-7">
                  مشخصات اصلی ملک را وارد کنید.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField
                    label="متراژ"
                    value={formatPersianNumber(
                      formData.area
                    )}
                    onChange={handleNumberChange(
                      "area"
                    )}
                    placeholder="مثلاً ۱۲۰"
                    suffix="متر"
                    error={errors.area}
                    inputMode="numeric"
                  />

                  <InputField
                    label="تعداد اتاق خواب"
                    value={toPersianDigits(
                      formData.bedrooms
                    )}
                    onChange={handleNumberChange(
                      "bedrooms"
                    )}
                    placeholder="مثلاً ۲"
                    error={errors.bedrooms}
                    inputMode="numeric"
                  />

                  <InputField
                    label="طبقه"
                    value={toPersianDigits(
                      formData.floor
                    )}
                    onChange={handleNumberChange(
                      "floor"
                    )}
                    placeholder="مثلاً ۳"
                    error={errors.floor}
                    inputMode="numeric"
                  />

                  <InputField
                    label="تعداد کل طبقات"
                    value={toPersianDigits(
                      formData.totalFloors
                    )}
                    onChange={handleNumberChange(
                      "totalFloors"
                    )}
                    placeholder="مثلاً ۵"
                    error={errors.totalFloors}
                    inputMode="numeric"
                  />

                  <InputField
                    label="سال ساخت"
                    value={toPersianDigits(
                      formData.yearBuilt
                    )}
                    onChange={handleNumberChange(
                      "yearBuilt"
                    )}
                    placeholder="مثلاً ۱۴۰۲"
                    error={errors.yearBuilt}
                    inputMode="numeric"
                  />
                </div>

                {formData.area && (
                  <div className="mt-5 rounded-xl bg-gray-1 p-4">
                    <p className="text-xs text-gray-7">
                      متراژ واردشده
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-13">
                      {formatPersianNumber(
                        formData.area
                      )}{" "}
                      متر مربع
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                  قیمت
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-7">
                  اطلاعات مالی آگهی را وارد کنید.
                </p>

                <div className="mt-6">
                  {formData.transactionType ===
                    "فروش" && (
                    <div>
                      <InputField
                        label="قیمت فروش"
                        value={formatPersianNumber(
                          formData.salePrice
                        )}
                        onChange={(event) =>
                          updateFormData(
                            "salePrice",
                            cleanNumber(
                              event.target.value
                            )
                          )
                        }
                        placeholder="مثلاً ۵,۰۰۰,۰۰۰,۰۰۰"
                        suffix="تومان"
                        error={errors.salePrice}
                        inputMode="numeric"
                      />

                      {formData.salePrice && (
                        <p className="mt-3 rounded-xl bg-[#CB1B1B]/5 px-4 py-3 text-sm text-gray-9">
                          حدوداً{" "}
                          <span className="font-bold text-[#CB1B1B]">
                            {numberToExactText(
                              formData.salePrice
                            )}{" "}
                            تومان
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {formData.transactionType ===
                    "اجاره" && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <InputField
                        label="مبلغ ودیعه"
                        value={formatPersianNumber(
                          formData.deposit
                        )}
                        onChange={(event) =>
                          updateFormData(
                            "deposit",
                            cleanNumber(
                              event.target.value
                            )
                          )
                        }
                        placeholder="مثلاً ۵۰۰,۰۰۰,۰۰۰"
                        suffix="تومان"
                        error={errors.deposit}
                        inputMode="numeric"
                      />

                      <InputField
                        label="اجاره ماهانه"
                        value={formatPersianNumber(
                          formData.rent
                        )}
                        onChange={(event) =>
                          updateFormData(
                            "rent",
                            cleanNumber(
                              event.target.value
                            )
                          )
                        }
                        placeholder="مثلاً ۲۰,۰۰۰,۰۰۰"
                        suffix="تومان"
                        error={errors.rent}
                        inputMode="numeric"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                  امکانات
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-7">
                  امکاناتی که ملک دارد را انتخاب کنید.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {amenities.map((amenity) => {
                    const selected =
                      formData.amenities.includes(
                        amenity
                      );

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          toggleAmenity(
                            amenity
                          )
                        }
                        className={`rounded-xl border px-3 py-3.5 text-right transition sm:px-4 sm:py-4 ${
                          selected
                            ? "border-[#CB1B1B] bg-[#CB1B1B]/5 text-[#CB1B1B]"
                            : "border-gray-3 text-gray-9 hover:border-gray-5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium sm:text-sm">
                            {amenity}
                          </span>

                          {selected && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CB1B1B] text-white">
                              <FiCheck
                                size={12}
                              />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formData.amenities.length >
                  0 && (
                  <div className="mt-6 rounded-xl bg-gray-1 p-4">
                    <p className="text-xs text-gray-7">
                      امکانات انتخاب‌شده
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.amenities.map(
                        (amenity) => (
                          <span
                            key={amenity}
                            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-10"
                          >
                            {amenity}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div>
                <div>
                  <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                    تصاویر و اطلاعات آگهی
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-7">
                    عنوان، توضیحات و تصاویر ملک را وارد
                    کنید.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-12">
                    عنوان آگهی
                  </label>

                  <input
                    value={formData.title}
                    onChange={(event) =>
                      updateFormData(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً آپارتمان ۱۲۰ متری در سعادت‌آباد"
                    className="w-full rounded-xl border border-gray-3 bg-white px-4 py-3 text-sm text-gray-13 outline-none transition placeholder:text-gray-6 focus:border-[#CB1B1B]"
                  />

                  {renderError(errors.title)}
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-12">
                    توضیحات
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateFormData(
                        "description",
                        event.target.value
                      )
                    }
                    rows={6}
                    placeholder="توضیحات کامل ملک، شرایط فروش یا اجاره و سایر موارد مهم را بنویسید..."
                    className="w-full resize-none rounded-xl border border-gray-3 bg-white px-4 py-3 text-sm leading-7 text-gray-13 outline-none transition placeholder:text-gray-6 focus:border-[#CB1B1B]"
                  />

                  {renderError(
                    errors.description
                  )}
                </div>

                {/* Images */}
                <div className="mt-7 border-t border-gray-3 pt-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-13">
                        تصاویر ملک
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-gray-7">
                        حداکثر ۱۰ تصویر با فرمت JPG،
                        PNG یا WEBP و حجم حداکثر ۵ مگابایت.
                      </p>
                    </div>

                    <span className="text-xs font-bold text-gray-8">
                      {toPersianDigits(
                        images.length
                      )}
                      /۱۰
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image) => {
                      const isMain =
                        image.id === mainImageId;

                      return (
                        <div
                          key={image.id}
                          className={`group relative overflow-hidden rounded-xl border ${
                            isMain
                              ? "border-[#CB1B1B]"
                              : "border-gray-3"
                          }`}
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={image.preview}
                              alt="تصویر ملک"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          {isMain && (
                            <div className="absolute right-2 top-2 rounded-md bg-[#CB1B1B] px-2 py-1 text-[10px] font-bold text-white">
                              تصویر اصلی
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/55 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                            {!isMain ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setMainImageId(
                                    image.id
                                  )
                                }
                                className="rounded-md bg-white px-2 py-1.5 text-[10px] font-medium text-gray-13"
                              >
                                اصلی
                              </button>
                            ) : (
                              <span />
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  image.id
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#CB1B1B]"
                              aria-label="حذف تصویر"
                            >
                              <FiTrash2
                                size={14}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {images.length < 10 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-4 bg-gray-1 px-3 text-center text-gray-8 transition hover:border-[#CB1B1B] hover:bg-[#CB1B1B]/5 hover:text-[#CB1B1B]">
                        <FiUploadCloud
                          size={25}
                        />

                        <span className="mt-2 text-xs font-medium sm:text-sm">
                          افزودن تصویر
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={
                            handleImageUpload
                          }
                        />
                      </label>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-1 px-4 py-3 text-xs leading-5 text-gray-7">
                      <FiImage
                        size={16}
                        className="shrink-0 text-[#CB1B1B]"
                      />

                      اولین تصویر انتخاب‌شده به عنوان
                      تصویر اصلی آگهی در نظر گرفته می‌شود.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                  موقعیت ملک
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-7">
                  شهر، منطقه و موقعیت دقیق ملک را مشخص
                  کنید.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField
                    label="شهر"
                    value={formData.city}
                    onChange={(event) =>
                      updateFormData(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً تهران"
                    error={errors.city}
                  />

                  <InputField
                    label="منطقه / محله"
                    value={formData.district}
                    onChange={(event) =>
                      updateFormData(
                        "district",
                        event.target.value
                      )
                    }
                    placeholder="مثلاً سعادت‌آباد"
                    error={errors.district}
                  />
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-3">
                  <SubmitMap
                    position={[
                      formData.latitude,
                      formData.longitude,
                    ]}
                    onPositionChange={(
                      position
                    ) => {
                      setFormData(
                        (previous) => ({
                          ...previous,
                          latitude:
                            position[0],
                          longitude:
                            position[1],
                        })
                      );

                      setErrors(
                        (previous) => ({
                          ...previous,
                          location:
                            undefined,
                        })
                      );
                    }}
                  />
                </div>

                {renderError(
                  errors.location
                )}

                <div className="mt-4 flex items-start gap-3 rounded-xl bg-gray-1 px-4 py-3">
                  <FiMapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#CB1B1B]"
                  />

                  <div>
                    <p className="text-xs text-gray-7">
                      موقعیت انتخاب‌شده
                    </p>

                    <p className="mt-1 text-xs font-medium leading-6 text-gray-10">
                      {formData.latitude.toFixed(
                        5
                      )}
                      ،{" "}
                      {formData.longitude.toFixed(
                        5
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <div>
                <div>
                  <h2 className="text-lg font-bold text-gray-13 sm:text-xl">
                    پیش‌نمایش آگهی
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-7">
                    این همان اطلاعاتی است که کاربر در آگهی
                    خواهد دید.
                  </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-3">
                  {/* Image */}
                  <div className="relative aspect-[16/9] bg-gray-2 sm:aspect-[16/8]">
                    {selectedMainImage ? (
                      <Image
                        src={
                          selectedMainImage.preview
                        }
                        alt={
                          formData.title ||
                          "تصویر ملک"
                        }
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-7">
                        <FiImage
                          size={28}
                        />

                        <span className="text-sm">
                          تصویری برای آگهی انتخاب نشده است.
                        </span>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex max-w-[calc(100%-24px)] flex-wrap gap-2 sm:right-4 sm:top-4">
                      {formData.transactionType && (
                        <span className="rounded-lg bg-[#CB1B1B] px-2.5 py-1.5 text-[11px] font-bold text-white sm:px-3 sm:text-xs">
                          {
                            formData.transactionType
                          }
                        </span>
                      )}

                      {formData.propertyType && (
                        <span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-gray-13 shadow-sm sm:px-3 sm:text-xs">
                          {formData.propertyType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 md:p-7">
                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold leading-8 text-gray-13 sm:text-xl md:text-2xl">
                        {formData.title ||
                          "عنوان آگهی"}
                      </h3>

                      {(formData.city ||
                        formData.district) && (
                        <div className="mt-2.5 flex items-start gap-2 text-sm text-gray-8">
                          <FiMapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-[#CB1B1B]"
                          />

                          <span>
                            {[
                              formData.city,
                              formData.district,
                            ]
                              .filter(Boolean)
                              .join("، ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main Specs */}
                    <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                      <PreviewSpec
                        label="متراژ"
                        value={
                          formData.area
                            ? `${formatPersianNumber(
                                formData.area
                              )} متر`
                            : "—"
                        }
                      />

                      <PreviewSpec
                        label="اتاق خواب"
                        value={
                          formData.bedrooms
                            ? `${toPersianDigits(
                                formData.bedrooms
                              )} خواب`
                            : "—"
                        }
                      />

                      <PreviewSpec
                        label="طبقه"
                        value={
                          formData.floor
                            ? toPersianDigits(
                                formData.floor
                              )
                            : "—"
                        }
                      />

                      <PreviewSpec
                        label="سال ساخت"
                        value={
                          formData.yearBuilt
                            ? toPersianDigits(
                                formData.yearBuilt
                              )
                            : "—"
                        }
                      />
                    </div>

                    {/* Additional Specs */}
                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <PreviewRow
                        label="نوع معامله"
                        value={getTransactionLabel(
                          formData.transactionType
                        )}
                      />

                      <PreviewRow
                        label="نوع ملک"
                        value={getPropertyLabel(
                          formData.propertyType
                        )}
                      />

                      {formData.totalFloors && (
                        <PreviewRow
                          label="تعداد کل طبقات"
                          value={toPersianDigits(
                            formData.totalFloors
                          )}
                        />
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-5 rounded-2xl bg-[#CB1B1B]/5 p-4 sm:p-5">
                      <h4 className="text-sm font-bold text-gray-13">
                        قیمت
                      </h4>

                      {formData.transactionType ===
                        "فروش" && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-7">
                            قیمت فروش
                          </p>

                          <p className="mt-1 text-lg font-bold text-[#CB1B1B] sm:text-xl">
                            {formData.salePrice
                              ? `${formatPersianNumber(
                                  formData.salePrice
                                )} تومان`
                              : "—"}
                          </p>
                        </div>
                      )}

                      {formData.transactionType ===
                        "اجاره" && (
                        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-7">
                              ودیعه
                            </p>

                            <p className="mt-1 text-base font-bold text-[#CB1B1B] sm:text-lg">
                              {formData.deposit
                                ? `${formatPersianNumber(
                                    formData.deposit
                                  )} تومان`
                                : "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-7">
                              اجاره ماهانه
                            </p>

                            <p className="mt-1 text-base font-bold text-[#CB1B1B] sm:text-lg">
                              {formData.rent
                                ? `${formatPersianNumber(
                                    formData.rent
                                  )} تومان`
                                : "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {formData.amenities.length >
                      0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-13">
                          امکانات
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.amenities.map(
                            (amenity) => (
                              <span
                                key={amenity}
                                className="rounded-lg bg-gray-2 px-3 py-2 text-xs text-gray-10"
                              >
                                {amenity}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-gray-13">
                        توضیحات
                      </h4>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-8">
                        {formData.description ||
                          "توضیحاتی برای این آگهی وارد نشده است."}
                      </p>
                    </div>

                    {/* All Images */}
                    {images.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-13">
                            تصاویر
                          </h4>

                          <span className="text-xs text-gray-7">
                            {toPersianDigits(
                              images.length
                            )}{" "}
                            تصویر
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                          {images.map(
                            (image) => (
                              <div
                                key={
                                  image.id
                                }
                                className={`relative aspect-square overflow-hidden rounded-xl border ${
                                  image.id ===
                                  mainImageId
                                    ? "border-[#CB1B1B]"
                                    : "border-gray-3"
                                }`}
                              >
                                <Image
                                  src={
                                    image.preview
                                  }
                                  alt="تصویر ملک"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />

                                {image.id ===
                                  mainImageId && (
                                  <span className="absolute right-1.5 top-1.5 rounded-md bg-[#CB1B1B] px-1.5 py-1 text-[9px] font-bold text-white">
                                    اصلی
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="mt-6 rounded-xl border border-gray-3 p-4">
                      <div className="flex items-start gap-3">
                        <FiMapPin
                          size={19}
                          className="mt-0.5 shrink-0 text-[#CB1B1B]"
                        />

                        <div>
                          <h4 className="text-sm font-bold text-gray-13">
                            موقعیت ملک
                          </h4>

                          <p className="mt-1 text-xs leading-6 text-gray-8">
                            {[
                              formData.city,
                              formData.district,
                            ]
                              .filter(Boolean)
                              .join("، ") ||
                              "موقعیت وارد نشده است"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="mt-5 rounded-xl border border-[#CB1B1B]/20 bg-[#CB1B1B]/5 px-4 py-3 text-sm leading-6 text-[#CB1B1B]">
                    {submitError}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-3 pt-5 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={
                  currentStep === 0 ||
                  isSubmitting
                }
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition sm:w-auto ${
                  currentStep === 0 ||
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-2 text-gray-5"
                    : "bg-gray-2 text-gray-11 hover:bg-gray-3"
                }`}
              >
                <FiArrowRight size={17} />
                مرحله قبل
              </button>

              {currentStep <
              steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CB1B1B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b81717] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  مرحله بعد

                  <FiArrowLeft size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CB1B1B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b81717] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      در حال ثبت...
                    </>
                  ) : (
                    <>
                      ثبت نهایی آگهی
                      <FiCheck size={17} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Desktop Live Summary */}
          <aside className="hidden lg:block lg:sticky lg:top-6">
            {liveSummary}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Components                                */
/* -------------------------------------------------------------------------- */

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  suffix?: string;
  error?: string;
  inputMode?: "text" | "numeric";
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  error,
  inputMode = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-12">
        {label}
      </label>

      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-13 outline-none transition placeholder:text-gray-6 focus:border-[#CB1B1B] ${
            error
              ? "border-[#CB1B1B]"
              : "border-gray-3"
          } ${suffix ? "pl-20" : ""}`}
        />

        {suffix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-7">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-[#CB1B1B]">
          {error}
        </p>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-1 p-3">
      <p className="text-[10px] text-gray-7">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-gray-12">
        {value}
      </p>
    </div>
  );
}

function PreviewSpec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-1 p-3.5 sm:p-4">
      <p className="text-[10px] text-gray-7 sm:text-xs">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-bold text-gray-13 sm:text-base">
        {value}
      </p>
    </div>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-3 p-3.5">
      <span className="text-xs text-gray-7">
        {label}
      </span>

      <span className="text-xs font-bold text-gray-13 sm:text-sm">
        {value}
      </span>
    </div>
  );
}