import { NextResponse } from "next/server";

import Order from "@/models/Order";
import Product from "@/models/Product";
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

    // Aggregate order items to sum quantity per productId
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          slug: "$product.slug",
          totalQuantity: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top selling products" },
      { status: 500 }
    );
  }
};
