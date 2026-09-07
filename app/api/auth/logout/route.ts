import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "saqfino_session";

export async function POST(request: Request) {
  try {
    const cookieHeader =
      request.headers.get("cookie");

    if (cookieHeader) {
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

      if (sessionToken) {
        await connectDB();

        const tokenHash = crypto
          .createHash("sha256")
          .update(sessionToken)
          .digest("hex");

        await Session.deleteOne({
          tokenHash,
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "با موفقیت از حساب کاربری خارج شدید.",
    });

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
  } catch (error) {
    console.error(
      "Logout API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام خروج از حساب کاربری رخ داد.",
      },
      { status: 500 },
    );
  }
}