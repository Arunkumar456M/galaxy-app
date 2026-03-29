import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { name } = await request.json();
  const newUser = new User({ name });
  await newUser.save();
  return NextResponse.json(newUser);
} 

export async function DELETE(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}

