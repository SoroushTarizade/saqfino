import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "saqfino_session";

const SESSION_MAX_AGE = 60 * 60 * 24;

function getSessionToken(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...valueParts] = cookie.trim().split("=");

      return [
        key,
        decodeURIComponent(valueParts.join("=")),
      ];
    }),
  );

  return cookies[SESSION_COOKIE_NAME] || null;
}

export async function POST(request: Request) {
  try {
    const sessionToken = getSessionToken(request);

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور فعلی و رمز عبور جدید الزامی هستند.",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
        },
        { status: 400 },
      );
    }

    if (newPassword.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور جدید نمی‌تواند بیشتر از ۱۲۸ کاراکتر باشد.",
        },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور جدید باید با رمز عبور فعلی متفاوت باشد.",
        },
        { status: 400 },
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
          message: "نشست کاربری معتبر نیست.",
        },
        { status: 401 },
      );
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await Session.deleteOne({
        _id: session._id,
      });

      const response = NextResponse.json(
        {
          success: false,
          message: "نشست کاربری منقضی شده است.",
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

    const user = await User.findById(session.userId);

    if (!user) {
      await Session.deleteMany({
        userId: session.userId,
      });

      return NextResponse.json(
        {
          success: false,
          message: "کاربر پیدا نشد.",
        },
        { status: 404 },
      );
    }

    const isCurrentPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور فعلی صحیح نیست.",
        },
        { status: 400 },
      );
    }

    const newPasswordHash =
      await bcrypt.hash(newPassword, 12);

    user.passwordHash = newPasswordHash;

    await user.save();

    /*
     * تمام Sessionهای قبلی را باطل می‌کنیم.
     */
    await Session.deleteMany({
      userId: user._id,
    });

    /*
     * یک Session جدید برای همین دستگاه ایجاد می‌کنیم
     * تا کاربر بعد از تغییر رمز از حساب خارج نشود.
     */
    const newSessionToken =
      crypto.randomBytes(32).toString("hex");

    const newSessionTokenHash =
      crypto
        .createHash("sha256")
        .update(newSessionToken)
        .digest("hex");

    const newSession = await Session.create({
      userId: user._id,
      tokenHash: newSessionTokenHash,
      expiresAt: new Date(
        Date.now() + SESSION_MAX_AGE * 1000,
      ),
    });

    const response = NextResponse.json({
      success: true,
      message:
        "رمز عبور با موفقیت تغییر کرد.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newSessionToken,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error(
      "Change password API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام تغییر رمز عبور رخ داد.",
      },
      { status: 500 },
    );
  }
}