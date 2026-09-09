import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "saqfino_session";

type Gender = "male" | "female" | "other" | "";

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

async function getAuthenticatedUser(request: Request) {
  const sessionToken = getSessionToken(request);

  if (!sessionToken) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "کاربر وارد نشده است.",
        },
        { status: 401 },
      ),
    };
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
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "نشست کاربری معتبر نیست.",
        },
        { status: 401 },
      ),
    };
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return {
      error: response,
    };
  }

  const user = await User.findById(session.userId);

  if (!user) {
    await Session.deleteOne({
      _id: session._id,
    });

    const response = NextResponse.json(
      {
        success: false,
        message: "کاربر مربوط به این نشست پیدا نشد.",
      },
      { status: 404 },
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return {
      error: response,
    };
  }

  return {
    user,
  };
}

function serializeUser(user: any) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
    avatar: user.avatar || "",
    emailVerified: user.emailVerified,
  };
}

export async function GET(request: Request) {
  try {
    const result = await getAuthenticatedUser(request);

    if (result.error) {
      return result.error;
    }

    return NextResponse.json({
      success: true,
      user: serializeUser(result.user),
    });
  } catch (error) {
    console.error("Auth me API error:", error);

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

export async function PATCH(request: Request) {
  try {
    const result = await getAuthenticatedUser(request);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : undefined;

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : undefined;

    const gender =
      typeof body.gender === "string"
        ? body.gender.trim()
        : undefined;

    if (
      firstName === undefined &&
      lastName === undefined &&
      gender === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "حداقل یک فیلد برای تغییر ارسال کنید.",
        },
        { status: 400 },
      );
    }

    if (firstName !== undefined) {
      if (!firstName) {
        return NextResponse.json(
          {
            success: false,
            message: "نام نمی‌تواند خالی باشد.",
          },
          { status: 400 },
        );
      }

      if (firstName.length > 50) {
        return NextResponse.json(
          {
            success: false,
            message: "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.",
          },
          { status: 400 },
        );
      }
    }

    if (lastName !== undefined) {
      if (!lastName) {
        return NextResponse.json(
          {
            success: false,
            message: "نام خانوادگی نمی‌تواند خالی باشد.",
          },
          { status: 400 },
        );
      }

      if (lastName.length > 80) {
        return NextResponse.json(
          {
            success: false,
            message:
              "نام خانوادگی نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.",
          },
          { status: 400 },
        );
      }
    }

    if (gender !== undefined) {
      const allowedGenders: Gender[] = [
        "",
        "male",
        "female",
        "other",
      ];

      if (!allowedGenders.includes(gender as Gender)) {
        return NextResponse.json(
          {
            success: false,
            message: "مقدار جنسیت معتبر نیست.",
          },
          { status: 400 },
        );
      }
    }

    const updateData: Record<string, string> = {};

    if (firstName !== undefined) {
      updateData.firstName = firstName;
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName;
    }

    if (gender !== undefined) {
      updateData.gender = gender;
    }

    const updatedUser = await User.findByIdAndUpdate(
      result.user._id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر پیدا نشد.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "اطلاعات حساب با موفقیت به‌روزرسانی شد.",
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    console.error("Auth me PATCH API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام به‌روزرسانی اطلاعات حساب رخ داد.",
      },
      { status: 500 },
    );
  }
}