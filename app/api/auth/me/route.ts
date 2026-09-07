import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "saqfino_session";

export async function GET(request: Request) {
  try {
    const cookieHeader =
      request.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
        },
        { status: 401 },
      );
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

    const sessionToken =
      cookies[SESSION_COOKIE_NAME];

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
        },
        { status: 401 },
      );
    }

    await connectDB();

    const tokenHash = crypto
      .createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const session = await Session.findOne({
      tokenHash,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "نشست کاربری معتبر نیست.",
        },
        { status: 401 },
      );
    }

    if (
      session.expiresAt.getTime() <=
      Date.now()
    ) {
      await Session.deleteOne({
        _id: session._id,
      });

      const response = NextResponse.json(
        {
          success: false,
          message:
            "نشست کاربری منقضی شده است.",
        },
        { status: 401 },
      );

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    const user = await User.findById(
      session.userId,
    );

    if (!user) {
      await Session.deleteOne({
        _id: session._id,
      });

      const response = NextResponse.json(
        {
          success: false,
          message:
            "کاربر مربوط به این نشست پیدا نشد.",
        },
        { status: 404 },
      );

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        avatar: user.avatar || "",
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error(
      "Auth me API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام دریافت اطلاعات کاربر رخ داد.",
      },
      { status: 500 },
    );
  }
}
