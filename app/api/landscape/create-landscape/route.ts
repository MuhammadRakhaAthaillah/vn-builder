import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, response: any) {
  try {
    let reqBody = await request.json();
    const session = await auth()

    const newLandscape = await prisma.landscape.create({
        data: {
            name: reqBody.name,
            desc: reqBody.desc || null,
            picture: reqBody.picture || null,
            xCordStart: reqBody.xCordStart,
            yCordStart: reqBody.yCordStart,
            xCordEnd: reqBody.xCordEnd,
            yCordEnd: reqBody.yCordEnd,
            creatorId: session?.user.id
        }
    })

    return NextResponse.json({
      status: "success",
      message: "A new landscape created successfully",
      data: newLandscape,
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
