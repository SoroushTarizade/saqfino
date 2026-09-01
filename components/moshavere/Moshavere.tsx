import Image from "next/image";

const features = [
  {
    image: "/images/Moshavere3.svg",
    alt: "مشاوره املاک",
    text: "امکان خرید و اجاره ملک در اکثر نقاط کشور",
    imageWidth: 62,
    imageHeight: 80,
  },
  {
    image: "/images/Moshavere2.svg",
    alt: "مقایسه املاک",
    text: "مقایسه و بررسی صدها ملک براحتی و در کمترین زمان",
    imageWidth: 95,
    imageHeight: 80,
  },
  {
    image: "/images/Moshavere1.svg",
    alt: "ارتباط با مشاورین",
    text: "ارتباط آسان با برترین املاک و مشاورین کشور",
    imageWidth: 130,
    imageHeight: 80,
  },
];

export default function Moshaver() {
  return (
    <section className="w-full py-6 md:py-10 lg:py-14">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1224px]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <h2 className="text-2xl font-bold leading-relaxed text-gray-11 sm:text-3xl md:text-4xl">
            همه به شما مشاوره می‌دهند!
          </h2>

          <p className="mt-2 text-base leading-8 text-gray-9 sm:text-lg md:text-xl">
            اما در سقفینو مشاوران املاک کِنار شما می‌مانند
          </p>
        </div>

        {/* Cards */}
        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-4
            md:justify-center
            md:gap-25
            md:overflow-visible
            md:pb-0
          "
        >
          {features.map((feature) => (
            <article
              key={feature.text}
              className="
                group
                flex
                h-[232px]
                min-w-[184px]
                flex-col
                items-center
                rounded-lg
                border
                border-gray-5/60
                bg-white
                px-4
                py-6
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
                hover:border-primary/30
                hover:shadow-[0_12px_30px_rgba(203,27,27,0.10)]
                md:min-w-0
                md:w-[184px]
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-[80px]
                  w-full
                  items-center
                  justify-center
                  transition-transform
                  duration-300
                  group-hover:-translate-y-1
                "
              >
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={feature.imageWidth}
                  height={feature.imageHeight}
                  className="h-auto max-h-[80px] w-auto object-contain"
                />
              </div>

              {/* Text */}
              <p
                className="
                  mt-4
                  flex
                  flex-1
                  items-center
                  justify-center
                  text-center
                  text-base
                  font-normal
                  leading-8
                  text-gray-10
                  transition-colors
                  duration-300
                  group-hover:text-gray-12
                "
              >
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}