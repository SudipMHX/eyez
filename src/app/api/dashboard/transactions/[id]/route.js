import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

import mongoose from "mongoose";
import { authorizeUser } from "@/lib/authorize";
import PaymentInfo from "@/models/PaymentInfo";

export async function GET(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Transaction ID format" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const transaction = await PaymentInfo.findById(id)
      .populate({ path: "userId", select: "name email" })
      .select("-__v");

    return NextResponse.json(
      {
        transaction: transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Transactions ID format" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const { status } = await request.json();

    const updatedData = {
      status: status,
    };

    const transaction = await PaymentInfo.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.error(`Error updating transaction with ID ${id}:`, error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
