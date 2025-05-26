import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

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
    const userInfo = await User.findById(session.user.id).select(
      "-password -__v -resetToken -resetTokenExpiry"
    );

    return NextResponse.json({ success: true, data: userInfo });
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
  const data = await req.json();

  try {
    const { name, phone_number, preferences } = data;

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...(name && { name }),
        ...(phone_number && { phone_number }),
        ...(preferences && { preferences }),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
