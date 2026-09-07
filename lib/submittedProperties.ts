export type SubmittedTransactionType =
  | "فروش"
  | "اجاره";

export type SubmittedPropertyType =
  | "آپارتمان"
  | "خانه"
  | "ویلا"
  | "زمین"
  | "تجاری";

export type SubmittedProperty = {
  id: number;

  transactionType: SubmittedTransactionType;
  propertyType: SubmittedPropertyType;

  title: string;
  description: string;

  area: number;
  bedrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;

  salePrice: number;
  deposit: number;
  rent: number;

  amenities: string[];

  city: string;
  district: string;

  latitude: number;
  longitude: number;

  image: string;
  images: string[];

  createdAt: number;
};

const STORAGE_KEY =
  "saqfino-submitted-properties";

export function getSubmittedProperties(): SubmittedProperty[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveSubmittedProperty(
  property: SubmittedProperty,
) {
  if (typeof window === "undefined") {
    return;
  }

  const current =
    getSubmittedProperties();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      property,
      ...current,
    ]),
  );
}

export function getSubmittedBuyProperties() {
  return getSubmittedProperties().filter(
    (property) =>
      property.transactionType ===
      "فروش",
  );
}

export function getSubmittedRentProperties() {
  return getSubmittedProperties().filter(
    (property) =>
      property.transactionType ===
      "اجاره",
  );
}