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

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order status breakdown" },
      { status: 500 }
    );
  }
};
