import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import Property from "@/models/Property";

export const dynamic = "force-dynamic";

/*
 * ----------------------------------------
 * Helpers
 * ----------------------------------------
 */

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
 * ----------------------------------------
 * GET /api/properties
 *
 * Public endpoint for:
 * - listing properties
 * - filtering
 * - searching
 * - sorting
 * - pagination
 * ----------------------------------------
 */

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    /*
     * ----------------------------------------
     * 1. Pagination
     * ----------------------------------------
     */

    const requestedPage = Number(
      searchParams.get("page"),
    );

    const requestedLimit = Number(
      searchParams.get("limit"),
    );

    const page = Math.max(
      Number.isFinite(requestedPage)
        ? Math.floor(requestedPage)
        : 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(requestedLimit)
          ? Math.floor(requestedLimit)
          : 10,
        1,
      ),
      50,
    );

    const skip = (page - 1) * limit;

    /*
     * ----------------------------------------
     * 2. Read filters
     * ----------------------------------------
     */

    const search =
      searchParams.get("search")?.trim() || "";

    const district =
      searchParams.get("district")?.trim() || "";

    const propertyType =
      searchParams
        .get("propertyType")
        ?.trim() || "";

    const price =
      searchParams.get("price")?.trim() || "";

    const area =
      searchParams.get("area")?.trim() || "";

    const bedroom =
      searchParams.get("bedroom")?.trim() || "";

    const buildYear =
      searchParams
        .get("buildYear")
        ?.trim() || "";

    const sort =
      searchParams.get("sort")?.trim() ||
      "جدیدترین";

    /*
     * ----------------------------------------
     * 3. Base database filter
     *
     * Only active BUY properties should
     * appear on /buy.
     * ----------------------------------------
     */

    const filter: Record<
      string,
      unknown
    > = {
      transactionType: "buy",
      status: "active",
    };

    /*
     * ----------------------------------------
     * 4. Search
     *
     * Search in:
     * - title
     * - city
     * - district
     * ----------------------------------------
     */

    if (search) {
      const safeSearch =
        escapeRegex(search);

      filter.$or = [
        {
          title: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          city: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          district: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    /*
     * ----------------------------------------
     * 5. District filter
     * ----------------------------------------
     */

    if (
      district &&
      district !== "همه مناطق"
    ) {
      filter.district = district;
    }

    /*
     * ----------------------------------------
     * 6. Property type filter
     *
     * Frontend Persian -> Database English
     * ----------------------------------------
     */

    if (
      propertyType &&
      propertyType !== "همه انواع"
    ) {
      const propertyTypeMap: Record<
        string,
        string
      > = {
        آپارتمان: "apartment",
        خانه: "house",
        ویلا: "villa",
        زمین: "land",
        تجاری: "commercial",
        "دفتر کار": "commercial",
      };

      const mappedType =
        propertyTypeMap[propertyType];

      if (mappedType) {
        filter.propertyType =
          mappedType;
      }
    }

    /*
     * ----------------------------------------
     * 7. Price filter
     *
     * Database:
     * salePrice = تومان
     * ----------------------------------------
     */

    if (
      price &&
      price !== "همه قیمت‌ها"
    ) {
      switch (price) {
        case "زیر ۵ میلیارد":
          filter.salePrice = {
            $lt: 5_000_000_000,
          };
          break;

        case "۵ تا ۱۰ میلیارد":
          filter.salePrice = {
            $gte: 5_000_000_000,
            $lte: 10_000_000_000,
          };
          break;

        case "۱۰ تا ۱۵ میلیارد":
          filter.salePrice = {
            $gt: 10_000_000_000,
            $lte: 15_000_000_000,
          };
          break;

        case "بالای ۱۵ میلیارد":
          filter.salePrice = {
            $gt: 15_000_000_000,
          };
          break;
      }
    }

    /*
     * ----------------------------------------
     * 8. Area filter
     * ----------------------------------------
     */

    if (
      area &&
      area !== "همه متراژها"
    ) {
      switch (area) {
        case "زیر ۸۰ متر":
          filter.area = {
            $lt: 80,
          };
          break;

        case "۸۰ تا ۱۲۰ متر":
          filter.area = {
            $gte: 80,
            $lte: 120,
          };
          break;

        case "۱۲۰ تا ۱۵۰ متر":
          filter.area = {
            $gt: 120,
            $lte: 150,
          };
          break;

        case "بالای ۱۵۰ متر":
          filter.area = {
            $gt: 150,
          };
          break;
      }
    }

    /*
     * ----------------------------------------
     * 9. Bedroom filter
     * ----------------------------------------
     */

    if (
      bedroom &&
      bedroom !== "همه تعداد اتاق‌ها"
    ) {
      switch (bedroom) {
        case "بدون اتاق":
          filter.bedrooms = 0;
          break;

        case "۱ خواب":
          filter.bedrooms = 1;
          break;

        case "۲ خواب":
          filter.bedrooms = 2;
          break;

        case "۳ خواب":
          filter.bedrooms = 3;
          break;

        case "۴ خواب و بیشتر":
          filter.bedrooms = {
            $gte: 4,
          };
          break;
      }
    }

    /*
     * ----------------------------------------
     * 10. Build year filter
     * ----------------------------------------
     */

    if (
      buildYear &&
      buildYear !== "همه سال‌ها"
    ) {
      switch (buildYear) {
        case "۱۴۰۳ به بعد":
          filter.yearBuilt = {
            $gte: 1403,
          };
          break;

        case "۱۴۰۰ تا ۱۴۰۲":
          filter.yearBuilt = {
            $gte: 1400,
            $lte: 1402,
          };
          break;

        case "۱۳۹۵ تا ۱۳۹۹":
          filter.yearBuilt = {
            $gte: 1395,
            $lte: 1399,
          };
          break;

        case "قبل از ۱۳۹۵":
          filter.yearBuilt = {
            $lt: 1395,
          };
          break;
      }
    }

    /*
     * ----------------------------------------
     * 11. Sorting
     *
     * _id is used as a stable tie-breaker
     * so pagination does not randomly shift
     * when two properties have the same value.
     * ----------------------------------------
     */

    let sortQuery: Record<
      string,
      1 | -1
    > = {
      createdAt: -1,
      _id: -1,
    };

    switch (sort) {
      case "ارزان‌ترین":
        sortQuery = {
          salePrice: 1,
          createdAt: -1,
          _id: -1,
        };
        break;

      case "گران‌ترین":
        sortQuery = {
          salePrice: -1,
          createdAt: -1,
          _id: -1,
        };
        break;

      case "متراژ بیشتر":
      case "بیشترین متراژ":
        sortQuery = {
          area: -1,
          createdAt: -1,
          _id: -1,
        };
        break;

      case "متراژ کمتر":
      case "کمترین متراژ":
        sortQuery = {
          area: 1,
          createdAt: -1,
          _id: -1,
        };
        break;

      case "جدیدترین":
      default:
        sortQuery = {
          createdAt: -1,
          _id: -1,
        };
        break;
    }

    /*
     * ----------------------------------------
     * 12. Query MongoDB
     *
     * IMPORTANT:
     * Filtering happens BEFORE pagination.
     *
     * This means:
     * - filters are applied to all properties
     * - total is correct
     * - pagination is correct
     * ----------------------------------------
     */

    const [
      properties,
      total,
    ] = await Promise.all([
      Property.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),

      Property.countDocuments(filter),
    ]);

    /*
     * ----------------------------------------
     * 13. Pagination info
     * ----------------------------------------
     */

    const totalPages =
      Math.ceil(total / limit);

    /*
     * ----------------------------------------
     * 14. Format MongoDB data
     * for frontend
     * ----------------------------------------
     */

    const formattedProperties =
      properties.map((property) => ({
        id: String(
          property._id,
        ),

        image:
          property.images?.[0] ||
          "/images/default.png",

        images:
          property.images &&
          property.images.length > 0
            ? property.images
            : ["/images/default.png"],

        title:
          property.title,

        location:
          `${property.city}، ${property.district}`,

        district:
          property.district,

        /*
         * Database:
         * تومان
         *
         * Frontend:
         * میلیون تومان
         */

        price:
          Math.round(
            (property.salePrice || 0) /
              1_000_000,
          ),

        area:
          property.area,

        bedrooms:
          property.bedrooms,

        floor:
          property.floor,

        totalFloors:
          property.totalFloors,

        yearBuilt:
          property.yearBuilt,

        type:
          property.propertyType,

        amenities:
          property.amenities || [],

        description:
          property.description,

        lat:
          property.latitude,

        lng:
          property.longitude,

        createdAt:
          new Date(
            property.createdAt,
          ).getTime(),
      }));

    /*
     * ----------------------------------------
     * 15. Return response
     * ----------------------------------------
     */

    return NextResponse.json(
      {
        success: true,

        properties:
          formattedProperties,

        pagination: {
          page,
          limit,
          total,
          totalPages,

          hasNextPage:
            page < totalPages,

          hasPreviousPage:
            page > 1,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "GET /api/properties error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "دریافت آگهی‌ها با خطا مواجه شد.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * ----------------------------------------
 * Allowed values for POST
 * ----------------------------------------
 */

const allowedTransactionTypes = [
  "buy",
  "rent",
] as const;

const allowedPropertyTypes = [
  "apartment",
  "house",
  "villa",
  "land",
  "commercial",
] as const;

type TransactionType =
  (typeof allowedTransactionTypes)[number];

type PropertyType =
  (typeof allowedPropertyTypes)[number];

/*
 * ----------------------------------------
 * POST /api/properties
 *
 * Creates a new property advertisement.
 * ----------------------------------------
 */

export async function POST(
  request: Request,
) {
  try {
    /*
     * ----------------------------------------
     * 1. Connect to MongoDB
     * ----------------------------------------
     */

    await connectDB();

    /*
     * ----------------------------------------
     * 2. Get session cookie
     * ----------------------------------------
     */

    const cookieStore =
      await cookies();

    const sessionToken =
      cookieStore.get(
        "saqfino_session",
      )?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "برای ثبت آگهی ابتدا وارد حساب کاربری شوید.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ----------------------------------------
     * 3. Hash session token
     * ----------------------------------------
     */

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(sessionToken)
        .digest("hex");

    /*
     * ----------------------------------------
     * 4. Find session
     * ----------------------------------------
     */

    const session =
      await Session.findOne({
        tokenHash,
      });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "نشست کاربری معتبر نیست.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ----------------------------------------
     * 5. Check session expiration
     * ----------------------------------------
     */

    if (
      session.expiresAt <
      new Date()
    ) {
      await Session.deleteOne({
        _id: session._id,
      });

      const response =
        NextResponse.json(
          {
            success: false,
            message:
              "نشست شما منقضی شده است. دوباره وارد شوید.",
          },
          {
            status: 401,
          },
        );

      response.cookies.set(
        "saqfino_session",
        "",
        {
          httpOnly: true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite: "lax",

          path: "/",

          expires:
            new Date(0),
        },
      );

      return response;
    }

    /*
     * ----------------------------------------
     * 6. Find current user
     * ----------------------------------------
     */

    const user =
      await User.findById(
        session.userId,
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "کاربر پیدا نشد.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * ----------------------------------------
     * 7. Email verification
     * ----------------------------------------
     */

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "برای ثبت آگهی ابتدا ایمیل خود را تأیید کنید.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * ----------------------------------------
     * 8. Read request body
     * ----------------------------------------
     */

    let body: Record<
      string,
      unknown
    >;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "اطلاعات ارسالی معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 9. Extract fields
     * ----------------------------------------
     */

    const {
      transactionType,
      propertyType,

      title,
      description,

      area,
      bedrooms,
      floor,
      totalFloors,
      yearBuilt,

      salePrice,
      deposit,
      rent,

      amenities,

      city,
      district,

      latitude,
      longitude,

      images,
    } = body;

    /*
     * ----------------------------------------
     * 10. Validate transaction type
     * ----------------------------------------
     */

    if (
      typeof transactionType !==
        "string" ||
      !allowedTransactionTypes.includes(
        transactionType as TransactionType,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "نوع معامله معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 11. Validate property type
     * ----------------------------------------
     */

    if (
      typeof propertyType !==
        "string" ||
      !allowedPropertyTypes.includes(
        propertyType as PropertyType,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "نوع ملک معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 12. Validate text fields
     * ----------------------------------------
     */

    if (
      typeof title !==
        "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "عنوان آگهی را وارد کنید.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      title.trim().length >
      150
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "عنوان آگهی نباید بیشتر از ۱۵۰ کاراکتر باشد.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof description !==
        "string" ||
      description.trim().length <
        20
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "توضیحات آگهی حداقل باید ۲۰ کاراکتر باشد.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof city !==
        "string" ||
      !city.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "شهر را وارد کنید.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof district !==
        "string" ||
      !district.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "محله را وارد کنید.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 13. Convert numeric values
     * ----------------------------------------
     */

    const numericArea =
      Number(area);

    const numericBedrooms =
      Number(bedrooms);

    const numericFloor =
      Number(floor);

    const numericTotalFloors =
      Number(totalFloors);

    const numericYearBuilt =
      Number(yearBuilt);

    const numericSalePrice =
      Number(
        salePrice ?? 0,
      );

    const numericDeposit =
      Number(
        deposit ?? 0,
      );

    const numericRent =
      Number(
        rent ?? 0,
      );

    const numericLatitude =
      Number(latitude);

    const numericLongitude =
      Number(longitude);

    /*
     * ----------------------------------------
     * 14. Validate area
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericArea,
      ) ||
      numericArea <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "متراژ ملک معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 15. Validate bedrooms
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericBedrooms,
      ) ||
      numericBedrooms < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "تعداد اتاق خواب معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 16. Validate floor
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericFloor,
      ) ||
      numericFloor < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "طبقه وارد شده معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 17. Validate total floors
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericTotalFloors,
      ) ||
      numericTotalFloors <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "تعداد کل طبقات معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 18. Validate year
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericYearBuilt,
      ) ||
      numericYearBuilt < 1300 ||
      numericYearBuilt > 1405
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "سال ساخت معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 19. Validate floor relationship
     * ----------------------------------------
     */

    if (
      numericFloor >
      numericTotalFloors
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "طبقه نمی‌تواند بیشتر از تعداد کل طبقات باشد.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 20. Validate latitude
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericLatitude,
      ) ||
      numericLatitude < -90 ||
      numericLatitude > 90
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "عرض جغرافیایی معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 21. Validate longitude
     * ----------------------------------------
     */

    if (
      !Number.isFinite(
        numericLongitude,
      ) ||
      numericLongitude < -180 ||
      numericLongitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "طول جغرافیایی معتبر نیست.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ----------------------------------------
     * 22. Validate price
     * according to transaction type
     * ----------------------------------------
     */

    if (
      transactionType ===
      "buy"
    ) {
      if (
        !Number.isFinite(
          numericSalePrice,
        ) ||
        numericSalePrice <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "قیمت فروش معتبر نیست.",
          },
          {
            status: 400,
          },
        );
      }
    }

    if (
      transactionType ===
      "rent"
    ) {
      if (
        !Number.isFinite(
          numericDeposit,
        ) ||
        numericDeposit < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "مبلغ ودیعه معتبر نیست.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !Number.isFinite(
          numericRent,
        ) ||
        numericRent < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "مبلغ اجاره معتبر نیست.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * ----------------------------------------
     * 23. Validate amenities
     * ----------------------------------------
     */

    const propertyAmenities =
      Array.isArray(
        amenities,
      )
        ? amenities.filter(
            (
              item,
            ): item is string =>
              typeof item ===
              "string",
          )
        : [];

    /*
     * ----------------------------------------
     * 24. Validate images
     *
     * Images are uploaded to Cloudinary
     * before this API request.
     * ----------------------------------------
     */

    let propertyImages: string[] = [];

    if (
      images !== undefined
    ) {
      if (
        !Array.isArray(
          images,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "اطلاعات تصاویر معتبر نیست.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * Maximum 10 images
       */

      if (
        images.length >
        10
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "حداکثر ۱۰ تصویر برای هر آگهی مجاز است.",
          },
          {
            status: 400,
          },
        );
      }

      const cloudinaryCloudName =
        process.env
          .CLOUDINARY_CLOUD_NAME;

      if (
        !cloudinaryCloudName
      ) {
        throw new Error(
          "CLOUDINARY_CLOUD_NAME is not configured",
        );
      }

      /*
       * Validate every image URL
       */

      for (
        const imageUrl of images
      ) {
        if (
          typeof imageUrl !==
          "string"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "یکی از آدرس‌های تصویر معتبر نیست.",
            },
            {
              status: 400,
            },
          );
        }

        try {
          const parsedUrl =
            new URL(
              imageUrl,
            );

          const isValidCloudinaryUrl =
            parsedUrl.protocol ===
              "https:" &&
            parsedUrl.hostname ===
              "res.cloudinary.com" &&
            parsedUrl.pathname.startsWith(
              `/${cloudinaryCloudName}/`,
            );

          if (
            !isValidCloudinaryUrl
          ) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "آدرس یکی از تصاویر معتبر نیست.",
              },
              {
                status: 400,
              },
            );
          }
        } catch {
          return NextResponse.json(
            {
              success: false,
              message:
                "آدرس یکی از تصاویر معتبر نیست.",
            },
            {
              status: 400,
            },
          );
        }

        propertyImages.push(
          imageUrl,
        );
      }
    }

    /*
     * ----------------------------------------
     * 25. Default image
     * ----------------------------------------
     */

    if (
      propertyImages.length ===
      0
    ) {
      propertyImages = [
        "/images/default.png",
      ];
    }

    /*
     * ----------------------------------------
     * 26. Create property
     *
     * IMPORTANT:
     * userId comes ONLY from the
     * authenticated session.
     * ----------------------------------------
     */

    const property =
      await Property.create({
        userId:
          user._id,

        title:
          title.trim(),

        transactionType:
          transactionType as TransactionType,

        propertyType:
          propertyType as PropertyType,

        area:
          numericArea,

        bedrooms:
          numericBedrooms,

        floor:
          numericFloor,

        totalFloors:
          numericTotalFloors,

        yearBuilt:
          numericYearBuilt,

        /*
         * BUY
         */

        salePrice:
          transactionType ===
          "buy"
            ? numericSalePrice
            : undefined,

        /*
         * RENT
         */

        deposit:
          transactionType ===
          "rent"
            ? numericDeposit
            : undefined,

        rent:
          transactionType ===
          "rent"
            ? numericRent
            : undefined,

        amenities:
          propertyAmenities,

        description:
          description.trim(),

        city:
          city.trim(),

        district:
          district.trim(),

        latitude:
          numericLatitude,

        longitude:
          numericLongitude,

        /*
         * Cloudinary URLs
         * or default image.
         */

        images:
          propertyImages,

        /*
         * New advertisements are
         * published immediately.
         */

        status: "active",
      });

    /*
     * ----------------------------------------
     * 27. Successful response
     * ----------------------------------------
     */

    return NextResponse.json(
      {
        success: true,

        message:
          "آگهی با موفقیت ثبت شد و اکنون در سایت منتشر شده است.",

        property: {
          id:
            property._id.toString(),

          status:
            property.status,

          title:
            property.title,

          images:
            property.images,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Create property error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "ثبت آگهی با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
      },
      {
        status: 500,
      },
    );
  }
}