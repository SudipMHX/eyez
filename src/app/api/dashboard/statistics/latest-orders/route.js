import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
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
    const latestOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .populate("userId", "name email -_id")
      .populate("items.productId", "name slug")
      .select("-shippingAddress -__v -paymentInfo -createdAt -updatedAt");
    return NextResponse.json({ success: true, data: latestOrders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
