import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/email";

export async function POST(req) {
  const { email } = await req.json();
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response("No user found", { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 15;

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"; // fallback for dev
  
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
  await sendResetEmail(email, resetUrl);

  return new Response("Reset email sent", { status: 200 });
}
