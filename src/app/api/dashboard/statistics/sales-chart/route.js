import { NextResponse } from "next/server";
import Order from "@/models/Order";
import dbConnect from "@/lib/mongoose";
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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: sevenDaysAgo },
          status: { $in: ["Delivered", "Shipped", "Processing"] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderDate" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({ success: true, data: salesData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
