import { NextResponse } from "next/server";
import Order from "@/models/Order";
import dbConnect from "@/lib/mongoose";
import { authorizeUser } from "@/lib/authorize";

export const GET = async () => {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    await dbConnect();

    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          averageOrderValue: { $avg: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const averageOrderValue =
      result.length > 0 ? result[0].averageOrderValue : 0;

    return NextResponse.json({
      success: true,
      data: { averageOrderValue: averageOrderValue.toFixed(2) },
    });
  } catch (error) {
    console.error("Error calculating average order value:", error);
    return NextResponse.json(
      { success: false, message: "Failed to calculate average order value" },
      { status: 500 }
    );
  }
};
