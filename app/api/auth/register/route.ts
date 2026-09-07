import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationToken from "@/models/EmailVerificationToken";

const resend = new Resend(
  process.env.RESEND_API_KEY,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
    } = body;

    // =========================
    // Validation
    // =========================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
        },
        { status: 400 },
      );
    }

    if (!["male", "female"].includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "جنسیت انتخاب‌شده معتبر نیست.",
        },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور و تکرار آن یکسان نیستند.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "رمز عبور باید حداقل ۸ کاراکتر باشد.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ایمیل واردشده معتبر نیست.",
        },
        { status: 400 },
      );
    }

    // =========================
    // Database
    // =========================

    await connectDB();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "کاربری با این ایمیل قبلاً ثبت‌نام کرده است.",
        },
        { status: 409 },
      );
    }

    // =========================
    // Password Hash
    // =========================

    const passwordHash = await bcrypt.hash(
      password,
      12,
    );

    // =========================
    // Create User
    // =========================

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      gender,
      avatar: "",
      emailVerified: false,
    });

    // =========================
    // Create Verification Token
    // =========================

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000,
    );

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    // =========================
    // Verification URL
    // =========================

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${appUrl}/verify-email?token=${verificationToken}`;

    // =========================
    // Send Email
    // =========================

    const { error: resendError } =
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Saqfino <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "تأیید ایمیل حساب سقفینو",
        html: `
          <!DOCTYPE html>
          <html lang="fa" dir="rtl">
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>تأیید ایمیل سقفینو</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f8f8f8;
                font-family: Arial, Tahoma, sans-serif;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: 40px auto;
                  padding: 0 20px;
                "
              >
                <div
                  style="
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 40px 32px;
                    text-align: right;
                    border: 1px solid #eeeeee;
                  "
                >
                  <div
                    style="
                      margin-bottom: 28px;
                      font-size: 28px;
                      font-weight: bold;
                      color: #cb1b1b;
                    "
                  >
                    سقفینو
                  </div>

                  <h1
                    style="
                      margin: 0 0 16px;
                      font-size: 24px;
                      color: #222222;
                    "
                  >
                    سلام ${user.firstName} عزیز 👋
                  </h1>

                  <p
                    style="
                      margin: 0 0 24px;
                      font-size: 16px;
                      line-height: 2;
                      color: #666666;
                    "
                  >
                    برای تکمیل ثبت‌نام در سقفینو،
                    لطفاً ایمیل خود را تأیید کنید.
                  </p>

                  <a
                    href="${verificationUrl}"
                    style="
                      display: inline-block;
                      padding: 14px 28px;
                      background: #cb1b1b;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      font-size: 16px;
                      font-weight: bold;
                    "
                  >
                    تأیید ایمیل
                  </a>

                  <p
                    style="
                      margin: 28px 0 8px;
                      font-size: 13px;
                      line-height: 1.8;
                      color: #999999;
                    "
                  >
                    این لینک فقط ۳۰ دقیقه اعتبار دارد.
                  </p>

                  <p
                    style="
                      margin: 0;
                      font-size: 13px;
                      line-height: 1.8;
                      color: #999999;
                    "
                  >
                    اگر شما این حساب را ایجاد نکرده‌اید،
                    می‌توانید این ایمیل را نادیده بگیرید.
                  </p>
                </div>

                <p
                  style="
                    margin: 20px 0;
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                  "
                >
                  © سقفینو
                </p>
              </div>
            </body>
          </html>
        `,
      });

    // =========================
    // Resend Error
    // =========================

    if (resendError) {
      console.error(
        "Resend email error:",
        resendError,
      );

      // Remove the user because the required
      // verification email could not be sent.
      await EmailVerificationToken.deleteOne({
        _id: (
          await EmailVerificationToken.findOne({
            tokenHash,
          })
        )?._id,
      });

      await User.deleteOne({
        _id: user._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "حساب ایجاد نشد چون ارسال ایمیل تأیید با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
        },
        { status: 500 },
      );
    }

    // =========================
    // Success
    // =========================

    return NextResponse.json(
      {
        success: true,
        message:
          "حساب کاربری ایجاد شد. لینک تأیید ایمیل برای شما ارسال شد.",
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Register API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام ایجاد حساب کاربری رخ داد.",
      },
      { status: 500 },
    );
  }
}
