import { NextResponse } from "next/server";
import PaymentInfo from "@/models/PaymentInfo";
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

    const usageCounts = await PaymentInfo.aggregate([
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = usageCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching payment method usage:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment method usage" },
      { status: 500 }
    );
  }
};
