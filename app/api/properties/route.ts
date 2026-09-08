import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import Property from "@/models/Property";

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
          expires: new Date(0),
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
     * 7. Make sure email is verified
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
      Number(salePrice ?? 0);

    const numericDeposit =
      Number(deposit ?? 0);

    const numericRent =
      Number(rent ?? 0);

    const numericLatitude =
      Number(latitude);

    const numericLongitude =
      Number(longitude);

    /*
     * ----------------------------------------
     * 14. Validate numeric values
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
     * 15. Validate floor relationship
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
     * 16. Validate location
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
     * 17. Validate price according to
     *     transaction type
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
     * 18. Validate amenities
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
     * 19. Validate images
     * ----------------------------------------
     *
     * Images are uploaded to Cloudinary
     * before this request reaches this API.
     *
     * The frontend sends only the returned
     * Cloudinary secure URLs.
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
     * 20. Use default image when no image
     *     was uploaded
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
     * 21. Create property
     * ----------------------------------------
     *
     * IMPORTANT:
     * userId comes from the authenticated
     * session, NOT from the frontend.
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

        salePrice:
          transactionType ===
          "buy"
            ? numericSalePrice
            : undefined,

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
         * Cloudinary image URLs
         * or the local default image.
         */

        images:
          propertyImages,

        /*
         * New advertisements should
         * initially wait for approval.
         */

        status: "pending",
      });

    /*
     * ----------------------------------------
     * 22. Return successful response
     * ----------------------------------------
     */

    return NextResponse.json(
      {
        success: true,

        message:
          "آگهی با موفقیت ثبت شد و در انتظار بررسی است.",

        property: {
          id: property._id.toString(),

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