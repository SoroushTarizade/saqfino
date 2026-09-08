import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "فایل تصویری ارسال نشده است.",
        },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "فقط تصاویر JPG، PNG و WebP مجاز هستند.",
        },
        { status: 400 },
      );
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد.",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const uploadResult =
      await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "saqfino/properties",
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(
                  error ||
                    new Error(
                      "Image upload failed",
                    ),
                );

                return;
              }

              resolve({
                secure_url:
                  result.secure_url,
                public_id:
                  result.public_id,
              });
            },
          );

        uploadStream.end(buffer);
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "تصویر با موفقیت آپلود شد.",
        image: {
          url: uploadResult.secure_url,
          publicId:
            uploadResult.public_id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Image upload API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطایی هنگام آپلود تصویر رخ داد.",
        },
      { status: 500 },
    );
  }
}