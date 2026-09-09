import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه ملک نامعتبر است.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const property =
      await Property.findOne({
        _id: id,
        transactionType: "buy",
        status: "active",
      }).lean();

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "ملک مورد نظر پیدا نشد.",
        },
        { status: 404 },
      );
    }

    const formattedProperty = {
      id: Number(
        property._id
          .toString()
          .slice(-8),
      ),

      mongoId: property._id.toString(),

      image:
        property.images?.[0] ??
        "/images/default.png",

      images:
        property.images?.length > 0
          ? property.images
          : ["/images/default.png"],

      title: property.title,

      location: `${property.city}، ${property.district}`,

      district: property.district,

      price: property.salePrice
        ? Math.round(
            property.salePrice /
              1_000_000,
          )
        : 0,

      area: property.area,

      bedrooms:
        property.bedrooms,

      floor:
        property.floor,

      totalFloors:
        property.totalFloors,

      yearBuilt:
        property.yearBuilt,

      type:
        property.propertyType,

      amenities:
        property.amenities ?? [],

      description:
        property.description,

      lat:
        property.latitude,

      lng:
        property.longitude,

      createdAt:
        property.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        property:
          formattedProperty,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "GET /api/properties/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "خطا در دریافت اطلاعات ملک.",
      },
      { status: 500 },
    );
  }
}