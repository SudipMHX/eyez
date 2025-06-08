import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

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
  const { name, email, number, address, city, zipcode, region, country } = data;

  console.log(data)
  console.log(session.user.id)
  console.log(session.user)

  const payload = {
    userId: session.user.id,
    name,
    email,
    number,
    address,
    city,
    zipcode,
    region,
    country,
  };

  try {
    const newAddress = await Address.create(payload);
    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  await dbConnect();

  const userId = session.user.id;
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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const data = await req.json();
  const { _id, name, email, number, address, city, zipcode, region, country } =
    data;

  const payload = {
    userId: session.user.id,
    _id,
    name,
    email,
    number,
    address,
    city,
    zipcode,
    region,
    country,
  };

  if (!session.user.id) {
    return NextResponse.json(
      { success: false, error: "Missing address ID" },
      { status: 400 }
    );
  }

  try {
    const updated = await Address.findByIdAndUpdate(_id, payload, {
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
