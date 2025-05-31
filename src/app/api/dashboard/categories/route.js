import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { authorizeUser } from "@/lib/authorize";
import Category from "@/models/Category";

export async function POST(request) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    await dbConnect();
    const body = await request.json();

    const newCategory = new Category(body);
    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json(
      {
        message: "categories data loaded  ",
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
