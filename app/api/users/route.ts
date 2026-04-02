import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/user";

// 🔹 GET USERS
export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth(); // ✅ IMPORTANT FIX

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const users = await User.find({ userId });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// 🔹 CREATE USER
export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId } = await auth(); // ✅ IMPORTANT FIX

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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE USER
export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { userId } = await auth(); // ✅ IMPORTANT FIX

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await User.findOneAndDelete({
      _id: id,
      userId,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}