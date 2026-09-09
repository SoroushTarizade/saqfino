import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const subject = body?.subject?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً همه فیلدها را کامل کنید.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "نام واردشده معتبر نیست.",
        },
        { status: 400 }
      );
    }

    if (email.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل واردشده معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً یک ایمیل معتبر وارد کنید.",
        },
        { status: 400 }
      );
    }

    if (subject.length < 2 || subject.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "موضوع پیام معتبر نیست.",
        },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "متن پیام باید بین ۱۰ تا ۵۰۰۰ کاراکتر باشد.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "سرویس ارسال پیام در حال حاضر در دسترس نیست.",
        },
        { status: 500 }
      );
    }

    const recipient = "soroushtarizadeh7139@gmail.com";

    const { error } = await resend.emails.send({
      from: "Saqfino <onboarding@resend.dev>",
      to: recipient,
      replyTo: email,
      subject: `پیام جدید از سقفینو: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>پیام جدید سقفینو</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
              direction: rtl;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid #e5e5e5;
              "
            >
              <div
                style="
                  background: #cb1b1b;
                  padding: 28px;
                  color: #ffffff;
                "
              >
                <h1
                  style="
                    margin: 0 0 8px;
                    font-size: 24px;
                  "
                >
                  پیام جدید از سقفینو
                </h1>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                  "
                >
                  یک پیام جدید از فرم تماس سایت دریافت شده است.
                </p>
              </div>

              <div style="padding: 32px;">
                <div style="margin-bottom: 24px;">
                  <strong style="display: block; margin-bottom: 8px;">
                    نام:
                  </strong>

                  <div
                    style="
                      padding: 12px 16px;
                      background: #f7f7f7;
                      border-radius: 8px;
                    "
                  >
                    ${escapeHtml(name)}
                  </div>
                </div>

                <div style="margin-bottom: 24px;">
                  <strong style="display: block; margin-bottom: 8px;">
                    ایمیل:
                  </strong>

                  <div
                    style="
                      padding: 12px 16px;
                      background: #f7f7f7;
                      border-radius: 8px;
                      direction: ltr;
                      text-align: left;
                    "
                  >
                    ${escapeHtml(email)}
                  </div>
                </div>

                <div style="margin-bottom: 24px;">
                  <strong style="display: block; margin-bottom: 8px;">
                    موضوع:
                  </strong>

                  <div
                    style="
                      padding: 12px 16px;
                      background: #f7f7f7;
                      border-radius: 8px;
                    "
                  >
                    ${escapeHtml(subject)}
                  </div>
                </div>

                <div>
                  <strong style="display: block; margin-bottom: 8px;">
                    پیام:
                  </strong>

                  <div
                    style="
                      padding: 16px;
                      background: #f7f7f7;
                      border-radius: 8px;
                      line-height: 2;
                      white-space: pre-wrap;
                    "
                  >
                    ${escapeHtml(message)}
                  </div>
                </div>
              </div>

              <div
                style="
                  padding: 20px 32px;
                  background: #fafafa;
                  border-top: 1px solid #eeeeee;
                  font-size: 12px;
                  color: #777777;
                "
              >
                این پیام از فرم تماس وب‌سایت سقفینو ارسال شده است.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "پیام شما با موفقیت ارسال شد.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "در پردازش پیام مشکلی پیش آمد.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

