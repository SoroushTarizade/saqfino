import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationToken from "@/models/EmailVerificationToken";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "توکن تأیید ایمیل ارسال نشده است.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const verificationToken =
      await EmailVerificationToken.findOne({
        tokenHash,
      });

    if (!verificationToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "لینک تأیید ایمیل معتبر نیست یا قبلاً استفاده شده است.",
        },
        { status: 400 },
      );
    }

    if (
      verificationToken.expiresAt.getTime() <
      Date.now()
    ) {
      await EmailVerificationToken.deleteOne({
        _id: verificationToken._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "لینک تأیید ایمیل منقضی شده است.",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(
      verificationToken.userId,
    );

    if (!user) {
      await EmailVerificationToken.deleteOne({
        _id: verificationToken._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "کاربر مربوط به این لینک پیدا نشد.",
        },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      await EmailVerificationToken.deleteOne({
        _id: verificationToken._id,
      });

      return NextResponse.json({
        success: true,
        message: "ایمیل شما قبلاً تأیید شده است.",
      });
    }

    user.emailVerified = true;

    await user.save();

    // Token is one-time use.
    await EmailVerificationToken.deleteOne({
      _id: verificationToken._id,
    });

    return NextResponse.json({
      success: true,
      message:
        "ایمیل شما با موفقیت تأیید شد.",
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام تأیید ایمیل رخ داد.",
      },
      { status: 500 },
    );
  }
}
