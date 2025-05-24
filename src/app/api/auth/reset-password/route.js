import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { hash } from "bcryptjs";

export async function POST(req) {
  const { token, password } = await req.json();
  await dbConnect();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return new Response("Token is invalid or has expired", { status: 400 });
  }

  user.password = await hash(password, 12);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return new Response("Password has been reset", { status: 200 });
}
