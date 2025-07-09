import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest, response: any) {
  try {
    let reqBody = await request.json();
    const foundUser = await prisma.user.findFirst({
      where: {
        email: reqBody.email,
      },
    });

    if (foundUser) {
      return NextResponse.json({
        status: "fail",
        message: "User already exists",
      });
    }

    if (reqBody.password) {
      reqBody.password = await bcrypt.hash(reqBody.password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        email: reqBody.email,
        password: reqBody.password,
        name: reqBody.name || null,
        profile_picture: reqBody.profile_picture || null,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (e) {
    console.log("An error occurred:", e);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: e,
    });
  }
}
