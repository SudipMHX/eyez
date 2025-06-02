import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

import Order from "@/models/Order";
import Address from "@/models/Address";
import Product from "@/models/Product";
import PaymentInfo from "@/models/PaymentInfo";
import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const orders = await Order.find({ userId: session.user._id })
      .populate("items.productId")
      .populate("Address")
      .populate("PaymentInfo")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const body = await req.json();

  try {
    const { userId, items, totalAmount, shippingAddress } = body;

    if (userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User Not Recognize, Please try again with logout and logged in.",
        },
        { status: 500 }
      );
    }

    const order = await Order.create({
      userId: session.user.id,
      items,
      totalAmount,
      shippingAddress,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const body = await req.json();

  try {
    const { orderId, status } = body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, userId: session.user._id },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
