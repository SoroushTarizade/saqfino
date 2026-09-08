import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import Property from "@/models/Property";

const SESSION_COOKIE_NAME =
  "saqfino_session";

function getSessionToken(
  request: Request,
) {
  const cookieHeader =
    request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => {
        const [key, ...valueParts] =
          cookie.trim().split("=");

        return [
          key,
          decodeURIComponent(
            valueParts.join("="),
          ),
        ];
      }),
  );

  return (
    cookies[SESSION_COOKIE_NAME] ||
    null
  );
}

export async function GET(
  request: Request,
) {
  try {
    /*
     * ----------------------------------------
     * 1. Get session token
     * ----------------------------------------
     */

    const sessionToken =
      getSessionToken(request);

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "برای مشاهده آگهی‌ها باید وارد حساب کاربری شوید.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * ----------------------------------------
     * 2. Connect to MongoDB
     * ----------------------------------------
     */

    await connectDB();

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
      session.expiresAt.getTime() <=
      Date.now()
    ) {
      await Session.deleteOne({
        _id: session._id,
      });

      const response =
        NextResponse.json(
          {
            success: false,
            message:
              "نشست کاربری شما منقضی شده است. دوباره وارد شوید.",
          },
          {
            status: 401,
          },
        );

      response.cookies.set(
        SESSION_COOKIE_NAME,
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
      ).select("_id");

    if (!user) {
      await Session.deleteOne({
        _id: session._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "کاربر مربوط به این نشست پیدا نشد.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * ----------------------------------------
     * 7. Get user's properties
     * ----------------------------------------
     *
     * IMPORTANT:
     * Only properties belonging to the
     * authenticated user are returned.
     */

    const properties =
      await Property.find({
        userId: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    /*
     * ----------------------------------------
     * 8. Format MongoDB documents
     * ----------------------------------------
     */

    const formattedProperties =
      properties.map(
        (property) => ({
          id: property._id.toString(),

          title:
            property.title,

          transactionType:
            property.transactionType,

          propertyType:
            property.propertyType,

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

          salePrice:
            property.salePrice ??
            null,

          deposit:
            property.deposit ??
            null,

          rent:
            property.rent ??
            null,

          amenities:
            property.amenities ??
            [],

          description:
            property.description,

          city:
            property.city,

          district:
            property.district,

          latitude:
            property.latitude,

          longitude:
            property.longitude,

          images:
            property.images?.length
              ? property.images
              : ["/images/default.png"],

          status:
            property.status,

          rejectionReason:
            property.rejectionReason ??
            null,

          createdAt:
            property.createdAt,

          updatedAt:
            property.updatedAt,
        }),
      );

    /*
     * ----------------------------------------
     * 9. Return properties
     * ----------------------------------------
     */

    return NextResponse.json(
      {
        success: true,
        properties:
          formattedProperties,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Get my properties API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "دریافت آگهی‌های شما با خطا مواجه شد.",
      },
      {
        status: 500,
      },
    );
  }
}