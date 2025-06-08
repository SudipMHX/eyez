import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { authorizeUser } from "@/lib/authorize";

export async function GET(req) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  await dbConnect();

  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      isPublished: true,
    })
      .sort({ stock: 1 })
      .select("name stock sku images.src");

    return NextResponse.json({ success: true, data: lowStockProducts });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
