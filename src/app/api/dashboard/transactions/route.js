import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";
import PaymentInfo from "@/models/PaymentInfo";
import { authorizeUser } from "@/lib/authorize";
import User from "@/models/User";

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

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query = {};

    // Add filters if they exist
    const trxId = searchParams.get("trxId") || "";
    const email = searchParams.get("email") || "";
    const orderId = searchParams.get("orderId") || "";
    const method = searchParams.get("method") || "";

    if (trxId) {
      query.trxId = { $regex: trxId, $options: "i" };
    }
    if (email) {
      const user = await User.findOne({ email: email }).select("_id");

      if (user) {
        query.userId = user._id;
      } else {
        return res.status(200).json({
          success: true,
          message: "No transactions found for this email",
          data: [],
          total: 0,
        });
      }
    }
    if (orderId) {
      query.orderId = orderId;
    }
    if (method) {
      query.method = method;
    }

    const transactions = await PaymentInfo.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email" })
      .select("-updatedAt -createdAt -__v");

    const totalTransactions = await PaymentInfo.countDocuments(query);

    return NextResponse.json(
      {
        transactions: transactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTransactions / limit),
          totalTransactions: totalTransactions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
