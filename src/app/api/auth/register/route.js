import { hash } from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password } = body;

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  await User.create({ name, email, password: hashedPassword });

  return new Response("User created", { status: 201 });
}
