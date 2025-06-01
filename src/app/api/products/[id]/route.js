import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  const { id } = params;
  const slug = id;

  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).populate("category");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
