import dbConnect from "@/lib/mongoose";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  try {
    const newAddress = await Address.create(data);
    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect();

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json(
      { success: false, error: "Missing userId" },
      { status: 400 }
    );

  try {
    const address = await Address.findOne({ userId });
    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await dbConnect();
  const data = await req.json();

  if (!data._id) {
    return NextResponse.json(
      { success: false, error: "Missing address ID" },
      { status: 400 }
    );
  }

  try {
    const updated = await Address.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
