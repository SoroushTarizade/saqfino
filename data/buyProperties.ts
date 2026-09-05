export type BuyProperty = {
  id: number;

  image: string;
  images: string[];

  title: string;
  location: string;
  district: string;

  price: number;
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

export const buyProperties: BuyProperty[] = [
  {
    id: 1,

    image: "/images/default.png",

    images: [
      "/images/default.png",
      "/images/rent1.png",
      "/images/rent2.png",
      "/images/rent3.png",
    ],

    title: "آپارتمان نوساز و خوش‌نقشه",
    location: "سعادت‌آباد، بلوار پاکنژاد",
    district: "منطقه ۲",

    price: 12500,
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
      "آپارتمان نوساز و مدرن در سعادت‌آباد با نقشه‌ای کاربردی و نورگیری مناسب. ساختمان دارای لابی، پارکینگ، آسانسور و انباری است و دسترسی بسیار خوبی به مراکز تجاری، خدماتی و مسیرهای اصلی شهر دارد.",

    lat: 35.784,
    lng: 51.375,

    createdAt: 5,
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

    title: "آپارتمان لوکس در ولیعصر",
    location: "خیابان ولیعصر، بالاتر از پارک وی",
    district: "منطقه ۱",

    price: 9800,
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
      "واحدی دلباز و خوش‌نقشه در یکی از محدوده‌های مطلوب شمال تهران. این ملک دارای امکانات کامل، نورگیری مناسب و دسترسی آسان به خیابان ولیعصر، پارک وی و مراکز خدماتی اطراف است.",

    lat: 35.785,
    lng: 51.407,

    createdAt: 4,
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

    title: "آپارتمان دوخوابه یوسف‌آباد",
    location: "یوسف‌آباد، خیابان اسدآبادی",
    district: "منطقه ۶",

    price: 7200,
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
      "واحدی مناسب و خوش‌نقشه در یوسف‌آباد با نورگیری خوب و دسترسی مناسب به مراکز خرید، حمل‌ونقل عمومی و امکانات شهری. گزینه‌ای مناسب برای سکونت خانوادگی.",

    lat: 35.735,
    lng: 51.403,

    createdAt: 3,
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

    title: "آپارتمان مدرن در نیاوران",
    location: "نیاوران، خیابان کامرانیه",
    district: "منطقه ۱",

    price: 18500,
    area: 175,

    bedrooms: 3,
    floor: 6,
    totalFloors: 8,
    yearBuilt: 1402,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
      "بالکن",
      "لابی",
      "نگهبانی",
    ],

    description:
      "آپارتمان مدرن و بزرگ در محدوده نیاوران با متراژ مناسب، طراحی داخلی مطلوب و امکانات کامل ساختمان. ملک دارای دسترسی مناسب به مراکز تجاری و مسیرهای اصلی شمال تهران است.",

    lat: 35.812,
    lng: 51.464,

    createdAt: 2,
  },

  {
    id: 5,

    image: "/images/default.png",

    images: [
      "/images/default.png",
      "/images/rent2.png",
      "/images/rent3.png",
      "/images/rent1.png",
    ],

    title: "آپارتمان خوش‌قیمت در ونک",
    location: "ونک، خیابان ملاصدرا",
    district: "منطقه ۳",

    price: 6500,
    area: 85,

    bedrooms: 2,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 1398,

    type: "آپارتمان",

    amenities: [
      "پارکینگ",
      "آسانسور",
      "انباری",
    ],

    description:
      "واحدی خوش‌نقشه و اقتصادی در محدوده ونک با دسترسی مناسب به بزرگراه‌ها، مراکز اداری و تجاری. ساختمان دارای پارکینگ، آسانسور و انباری است.",

    lat: 35.758,
    lng: 51.410,

    createdAt: 1,
  },
];