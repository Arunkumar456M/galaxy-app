import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user";

export async function GET() {
  await connectDB();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json([]);
  }

  const users = await User.find({ userId });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await connectDB();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const newUser = await User.create({
    name,
    userId,
  });

  return NextResponse.json(newUser);
}

export async function DELETE(request: Request) {
  await connectDB();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await User.findOneAndDelete({
    _id: id,
    userId,
  });

  return NextResponse.json({ success: true });
}