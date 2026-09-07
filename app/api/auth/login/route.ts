import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "saqfino_session";

const DEFAULT_SESSION_DAYS = 1;
const REMEMBER_ME_SESSION_DAYS = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "لطفاً ایمیل و رمز عبور را وارد کنید.",
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
          message: "ایمیل واردشده معتبر نیست.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ایمیل یا رمز عبور اشتباه است.",
        },
        { status: 401 },
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "لطفاً ابتدا ایمیل خود را تأیید کنید.",
        },
        { status: 403 },
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ایمیل یا رمز عبور اشتباه است.",
        },
        { status: 401 },
      );
    }

    // Generate a cryptographically secure session token.
    const sessionToken =
      crypto.randomBytes(32).toString("hex");

    // Only the hash of the session token is stored in MongoDB.
    const tokenHash = crypto
      .createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const sessionDays = rememberMe
      ? REMEMBER_ME_SESSION_DAYS
      : DEFAULT_SESSION_DAYS;

    const expiresAt = new Date(
      Date.now() +
        sessionDays * 24 * 60 * 60 * 1000,
    );

    await Session.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "ورود با موفقیت انجام شد.",
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          avatar: user.avatar || "",
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error(
      "Login API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام ورود به حساب کاربری رخ داد.",
      },
      { status: 500 },
    );
  }
}
