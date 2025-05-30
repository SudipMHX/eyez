import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function authorizeUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        authorized: false,
        error: "Unauthorized: Not logged in",
        status: 401,
      };
    }

    await dbConnect();
    const dbUser = await User.findById(session.user.id).select("role").lean();

    if (!dbUser) {
      return {
        authorized: false,
        error: "Unauthorized: User not found",
        status: 401,
      };
    }

    if (!["admin", "manager"].includes(dbUser.role)) {
      return {
        authorized: false,
        error: "Forbidden: Insufficient permissions",
        status: 403,
      };
    }

    return { authorized: true, user: dbUser };
  } catch (error) {
    console.error("Authorization error:", error);
    return {
      authorized: false,
      error: "Internal server error",
      status: 500,
    };
  }
}
