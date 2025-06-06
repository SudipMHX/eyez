import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/authorize";
import dbConnect from "@/lib/mongoose";

import Product from "@/models/Product";
import PaymentInfo from "@/models/PaymentInfo";
import Order from "@/models/Order";

export async function GET(request) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // 2. Pagination and Search Parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    // Correct way to get searchBy with a default value
    const searchBy = searchParams.get("searchBy") || "";

    // 3. Build the Aggregation Pipeline
    const matchStage = {};
    if (search) {
      if (searchBy === "orderId" && mongoose.Types.ObjectId.isValid(search)) {
        // Search by Order ID (exact match)
        matchStage._id = new mongoose.Types.ObjectId(search);
      } else if (searchBy === "email") {
        // Search by User Email
        matchStage["user.email"] = { $regex: search, $options: "i" };
      } else if (searchBy === "trxId") {
        // Search by Transaction ID
        matchStage["paymentInfo.trxId"] = { $regex: search, $options: "i" };
      }
    }

    // 4. Aggregation pipeline to fetch orders
    const ordersPipeline = [
      // Join with users collection
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Join with paymentinfos collection
      {
        $lookup: {
          from: "paymentinfos",
          localField: "paymentInfo",
          foreignField: "_id",
          as: "paymentInfo",
        },
      },
      // Deconstruct the user and paymentInfo arrays
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$paymentInfo", preserveNullAndEmptyArrays: true } },
      // Apply search filters
      { $match: matchStage },
      // Sort by creation date
      { $sort: { createdAt: -1 } },
      // Pagination: Skip
      { $skip: skip },
      // Pagination: Limit
      { $limit: limit },
      // Join with products collection for item details
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      // Final projection to shape the output
      {
        $project: {
          _id: 1,
          orderStatus: 1,
          totalAmount: 1,
          orderDate: 1,
          status: 1,
          userId: { name: "$user.name", email: "$user.email" },
          paymentInfo: {
            method: "$paymentInfo.method",
            status: "$paymentInfo.status",
            amount: "$paymentInfo.amount",
            trxId: "$paymentInfo.trxId",
            paymentDate: "$paymentInfo.paymentDate",
          },
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                quantity: "$$item.quantity",
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$productDetails",
                        as: "pd",
                        cond: { $eq: ["$$pd._id", "$$item.productId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
          createdAt: 1,
        },
      },
      // Clean up the product details within items
      {
        $project: {
          "items.product.description": 0,
          "items.product.reviews": 0,
          "items.product.category": 0,
          "items.product.tags": 0,
          "items.product.videos": 0,
          "items.product.brand": 0,
          "items.product.variants": 0,
          "items.product.isPublished": 0,
          "items.product.featured": 0,
          "items.product.dimensions": 0,
          "items.product.weight": 0,
          "items.product.seo": 0,
          "items.product.stockStatus": 0,
          "items.product.stock": 0,
          "items.product.isFeatured": 0,
          "items.product.createdAt": 0,
          "items.product.updatedAt": 0,
          "items.product.__v": 0,
          "user._id": 0,
          "paymentInfo._id": 0,
        },
      },
    ];

    // 5. Aggregation pipeline to count total matching documents
    const countPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "paymentinfos",
          localField: "paymentInfo",
          foreignField: "_id",
          as: "paymentInfo",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$paymentInfo", preserveNullAndEmptyArrays: true } },
      { $match: matchStage },
      { $count: "total" },
    ];

    const [orders, total] = await Promise.all([
      Order.aggregate(ordersPipeline),
      Order.aggregate(countPipeline),
    ]);

    const totalOrders = total.length > 0 ? total[0].total : 0;

    return NextResponse.json(
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders: totalOrders,
        },
      },
      { status: 200 }
    );
    // await dbConnect();
    // const { searchParams } = new URL(request.url);

    // await dbConnect();

    // const page = parseInt(searchParams.get("page") || "1");
    // const limit = parseInt(searchParams.get("limit") || "10");
    // const skip = (page - 1) * limit;

    // const query = {};

    // // Add filters if they exist
    // const search = searchParams.get("search") || "";
    // const searchBy = searchParams.get("searchBy" || "");
    // const trxId = searchParams.get("trxId" || "");
    // const email = searchParams.get("email" || "");

    // if (!searchBy || searchBy === "name") {
    //   query.name = { $regex: search, $options: "i" };
    // } else if (searchBy === "email") {
    //   query.email = { $regex: search, $options: "i" };
    // } else if (searchBy === "trxId") {
    //   query.paymentInfo.trxId = { $regex: search, $options: "i" };
    // } else if (searchBy === "orderId") {
    //   query._id = { $regex: search, $options: "i" };
    // }

    // const orders = await Order.find(query)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 })
    //   .populate({
    //     path: "paymentInfo",
    //     select: "method status amount trxId paymentDate",
    //   })
    //   .populate({
    //     path: "items.productId",
    //     select: "name slug price brand images sku",
    //   })
    //   .populate({
    //     path: "userId",
    //     select: "name email",
    //   })
    //   .select("-shippingAddress -updatedAt -createdAt -__v");

    // const totalOrders = await Order.countDocuments(query);

    // return NextResponse.json(
    //   {
    //     orders: orders,
    //     pagination: {
    //       currentPage: page,
    //       totalPages: Math.ceil(totalOrders / limit),
    //       totalProducts: totalOrders,
    //     },
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
