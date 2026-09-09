import Image from "next/image";
import Link from "next/link";

const propertyTypes = [
  {
    title: "خانه مسکونی",
    count: "7,300",
    image: "/images/Rectangle55.png",
    href: "/amlak/",
  },
  {
    title: "آپارتمان و برج",
    count: "2,300",
    image: "/images/Rectangle54.png",
    href: "/amlak/",
  },
  {
    title: "ویلا",
    count: "200",
    image: "/images/Rectangle53.png",
    href: "/amlak/",
  },
  {
    title: "تجاری و اداری",
    count: "120",
    image: "/images/Rectangle52.png",
    href: "/amlak/",
  },
];

export default function Look() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1224px]">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl font-bold text-gray-11 md:text-4xl">
            ملک مورد نظر خود را پیدا کنید
          </h2>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {propertyTypes.map((property) => (
            <Link
              key={property.title}
              href={property.href}
              className="
                group
                overflow-hidden
                rounded-sm
                bg-gray-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2
              "
            >
              {/* Image */}
              <div className="relative aspect-[288/239] overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  sizes="
                    (max-width: 767px) 50vw,
                    (max-width: 1199px) 25vw,
                    288px
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Content */}
              <div className="flex min-h-[101px] flex-col items-center justify-center gap-2 px-3 py-4 text-center">
                <span className="text-lg font-bold text-gray-11 md:text-xl">
                  {property.count}
                </span>

                <span className="text-sm text-gray-10 md:text-base">
                  {property.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
