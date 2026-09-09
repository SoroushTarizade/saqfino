import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationToken from "@/models/EmailVerificationToken";

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
          message: "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
        },
        { status: 400 },
      );
    }

    if (!["male", "female"].includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          message: "جنسیت انتخاب‌شده معتبر نیست.",
        },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور و تکرار آن یکسان نیستند.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل واردشده معتبر نیست.",
        },
        { status: 400 },
      );
    }

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

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      gender,
      avatar: "",
      emailVerified: false,
    });

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

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

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${appUrl}/verify-email?token=${verificationToken}`;

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      throw new Error(
        "SMTP_USER and SMTP_PASSWORD environment variables are required.",
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    try {
      await transporter.sendMail({
        from: `Saqfino <${smtpUser}>`,
        to: normalizedEmail,
        subject: "تأیید ایمیل حساب سقفینو",
        html: `
          <div
            dir="rtl"
            style="
              margin: 0;
              padding: 40px 20px;
              background-color: #f7f7f7;
              font-family: Arial, Tahoma, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              "
            >
              <div
                style="
                  text-align: center;
                  margin-bottom: 30px;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #cb1b1b;
                    font-size: 32px;
                  "
                >
                  سقفینو
                </h1>
              </div>

              <h2
                style="
                  color: #222222;
                  font-size: 22px;
                  margin-bottom: 20px;
                "
              >
                تأیید ایمیل حساب کاربری
              </h2>

              <p
                style="
                  color: #555555;
                  font-size: 16px;
                  line-height: 2;
                  margin-bottom: 20px;
                "
              >
                سلام،
              </p>

              <p
                style="
                  color: #555555;
                  font-size: 16px;
                  line-height: 2;
                  margin-bottom: 25px;
                "
              >
                برای تکمیل ثبت‌نام در سقفینو، لطفاً روی
                دکمه زیر کلیک کنید و ایمیل خود را تأیید کنید.
              </p>

              <div
                style="
                  text-align: center;
                  margin: 30px 0;
                "
              >
                <a
                  href="${verificationUrl}"
                  style="
                    display: inline-block;
                    background-color: #cb1b1b;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                  "
                >
                  تأیید ایمیل
                </a>
              </div>

              <p
                style="
                  color: #777777;
                  font-size: 14px;
                  line-height: 2;
                  margin-top: 25px;
                "
              >
                این لینک فقط به مدت ۳۰ دقیقه معتبر است.
              </p>

              <p
                style="
                  color: #999999;
                  font-size: 13px;
                  line-height: 2;
                  margin-top: 20px;
                  word-break: break-all;
                "
              >
                اگر دکمه بالا برای شما کار نکرد، می‌توانید
                لینک زیر را در مرورگر خود باز کنید:
              </p>

              <p
                style="
                  color: #cb1b1b;
                  font-size: 12px;
                  line-height: 1.8;
                  word-break: break-all;
                "
              >
                ${verificationUrl}
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #eeeeee;
                  margin: 30px 0;
                "
              />

              <p
                style="
                  color: #999999;
                  font-size: 12px;
                  line-height: 1.8;
                  text-align: center;
                  margin: 0;
                "
              >
                اگر شما این درخواست را ایجاد نکرده‌اید،
                می‌توانید این ایمیل را نادیده بگیرید.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Gmail SMTP email error:",
        emailError,
      );

      await EmailVerificationToken.deleteOne({
        tokenHash,
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