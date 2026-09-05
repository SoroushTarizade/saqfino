export type Property = {
  id: number;
  image: string;
  images: string[];

  title: string;
  location: string;
  district: string;

  deposit: number;
  rent: number;

  area: number;
  bedrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;

  type: string;

  amenities: string[];

  description: string;

  lat: number;
  lng: number;

  createdAt: number;
};

export const properties: Property[] = [
  {
    id: 1,
    image: "/images/default.png",

    images: [
      "/images/default.png",
      "/images/rent1.png",
      "/images/rent2.png",
      "/images/rent3.png",
    ],

    title: "رهن و اجاره آپارتمان",
    location: "محدوده ولیعصر، تابان",
    district: "منطقه ۶",

    deposit: 600,
    rent: 30,

    area: 100,
    bedrooms: 2,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 1401,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
      "بالکن",
    ],

    description:
      "آپارتمان خوش‌نقشه و نورگیر در محدوده ولیعصر، مناسب برای خانواده. ملک دارای دسترسی مناسب به مراکز خرید، حمل‌ونقل عمومی و امکانات شهری است.",

    lat: 35.7219,
    lng: 51.4078,

    createdAt: 4,
  },

  {
    id: 2,
    image: "/images/rent1.png",

    images: [
      "/images/rent1.png",
      "/images/rent2.png",
      "/images/rent3.png",
      "/images/default.png",
    ],

    title: "رهن و اجاره آپارتمان",
    location: "خیابان ولیعصر، بالاتر از پارک وی",
    district: "منطقه ۱",

    deposit: 850,
    rent: 35,

    area: 120,
    bedrooms: 2,
    floor: 4,
    totalFloors: 6,
    yearBuilt: 1400,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
      "نگهبانی",
    ],

    description:
      "واحدی دلباز و خوش‌نقشه در یکی از محدوده‌های مطلوب شمال تهران. ساختمان دارای امکانات کامل و دسترسی مناسب به خیابان ولیعصر و پارک وی است.",

    lat: 35.785,
    lng: 51.407,

    createdAt: 3,
  },

  {
    id: 3,
    image: "/images/rent2.png",

    images: [
      "/images/rent2.png",
      "/images/rent3.png",
      "/images/default.png",
      "/images/rent1.png",
    ],

    title: "رهن و اجاره واحد مسکونی",
    location: "یوسف‌آباد، خیابان اسدآبادی",
    district: "منطقه ۶",

    deposit: 500,
    rent: 25,

    area: 90,
    bedrooms: 2,
    floor: 2,
    totalFloors: 4,
    yearBuilt: 1399,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
    ],

    description:
      "واحد مسکونی مناسب در یوسف‌آباد با نورگیری خوب و نقشه کاربردی. این ملک برای سکونت خانوادگی گزینه مناسبی محسوب می‌شود.",

    lat: 35.735,
    lng: 51.403,

    createdAt: 2,
  },

  {
    id: 4,
    image: "/images/rent3.png",

    images: [
      "/images/rent3.png",
      "/images/rent1.png",
      "/images/rent2.png",
      "/images/default.png",
    ],

    title: "رهن و اجاره آپارتمان نوساز",
    location: "سعادت‌آباد، بلوار پاکنژاد",
    district: "منطقه ۲",

    deposit: 1200,
    rent: 45,

    area: 145,
    bedrooms: 3,
    floor: 5,
    totalFloors: 7,
    yearBuilt: 1403,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
      "بالکن",
      "لابی",
    ],

    description:
      "آپارتمان نوساز و مدرن در سعادت‌آباد با متراژ مناسب و امکانات کامل. ساختمان دارای لابی، پارکینگ و آسانسور بوده و دسترسی مناسبی به مراکز تجاری و خدماتی دارد.",

    lat: 35.784,
    lng: 51.375,

    createdAt: 1,
  },
];