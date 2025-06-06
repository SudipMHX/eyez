import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/authorize";
import dbConnect from "@/lib/mongoose";

import Product from "@/models/Product";
import User from "@/models/User";
import PaymentInfo from "@/models/PaymentInfo";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Product ID format" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate({
        path: "paymentInfo",
        select: "method status amount trxId paymentDate",
      })
      .populate({
        path: "userId",
        select: "name email -_id",
      })
      .populate({
        path: "items.productId",
        select: "name slug shortDescription price brand images sku",
      })
      .select("-updatedAt -createdAt -__v");

    return NextResponse.json(
      {
        message: "",
        order: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  const { id } = params;
  const { status, paymentStatus } = await request.json();

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Order ID format" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const update = {};
    if (status) update.status = status;

    const updatedOrder = await Order.findByIdAndUpdate(id, update, {
      new: true,
    });

    const updatePaymentInfo = {};
    if (paymentStatus) updatePaymentInfo.status = paymentStatus;

    const updatePayment = await PaymentInfo.findOneAndUpdate(
      { orderId: id },
      updatePaymentInfo
    );

    return NextResponse.json(
      {
        message: "Order status updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
