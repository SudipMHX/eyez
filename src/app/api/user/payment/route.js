import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import PaymentInfo from "@/models/PaymentInfo";

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
    const payments = await PaymentInfo.find({ userId: session.user.id })
      .populate("orderId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payments });
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
  const data = await req.json();

  try {
    const {
      orderId,
      method, // e.g., "bKash", "Nagad", etc.
      amount,
      trxId,
      notes,
    } = data;

    const payment = await PaymentInfo.create({
      orderId,
      userId: session.user.id,
      method,
      amount,
      trxId,
      notes,
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
