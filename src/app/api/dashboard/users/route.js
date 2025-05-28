import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["admin", "manager"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const {
      search = "",
      field = "name",
      role = "all",
      limit = 20,
    } = Object.fromEntries(req.nextUrl.searchParams);

    const query = {};

    // 1. Add role filter
    if (role !== "all") {
      query.role = role;
    }

    // 2. Add search filter
    if (search && ["name", "email", "phone_number"].includes(field)) {
      query[field] = { $regex: search, $options: "i" }; // case-insensitive
    }

    const users = await User.aggregate([
      { $match: query },
      {
        $addFields: {
          rolePriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$role", "admin"] }, then: 0 },
                { case: { $eq: ["$role", "manager"] }, then: 1 },
                { case: { $eq: ["$role", "user"] }, then: 2 },
              ],
              default: 99,
            },
          },
        },
      },
      { $sort: { rolePriority: 1, name: 1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          password: 0,
          preferences: 0,
          rolePriority: 0,
        },
      },
    ]);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
