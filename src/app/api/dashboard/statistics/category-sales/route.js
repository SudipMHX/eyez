import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Category from "@/models/Category";
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

    // Step 1: Aggregate sales grouped by category ID
    const salesByCategory = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSales: { $sum: "$items.totalPrice" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    // Convert to map for quick lookup
    const salesMap = {};
    for (const sale of salesByCategory) {
      salesMap[sale._id.toString()] = sale;
    }

    // Step 2: Get all categories and combine with sales data
    const categories = await Category.find().lean();

    const result = categories.map((cat) => {
      const sales = salesMap[cat._id.toString()] || {
        totalSales: 0,
        totalQuantity: 0,
      };
      return {
        categoryId: cat._id,
        categoryName: cat.name,
        totalSales: sales.totalSales,
        totalQuantity: sales.totalQuantity,
      };
    });

    // Optional: Sort descending by totalSales
    result.sort((a, b) => b.totalSales - a.totalSales);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching category sales with zero-fill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category sales" },
      { status: 500 }
    );
  }
};
