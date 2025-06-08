import { NextResponse } from "next/server";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
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
    const [totalRevenueData, totalOrders, totalCustomers, totalProducts] =
      await Promise.all([
        Order.aggregate([
          {
            $match: { status: "Delivered" },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ]),
        Order.countDocuments(),
        User.countDocuments({ role: "user" }),
        Product.countDocuments({ isPublished: true }),
      ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
