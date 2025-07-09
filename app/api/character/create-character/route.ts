import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, response: any) {
  try {
    let reqBody = await request.json();
    const session = await auth()

    const newCharacter = await prisma.character.create({
        data: {
            name: reqBody.name,
            desc: reqBody.desc || null,
            picture: reqBody.picture || null,
            creatorId: session?.user.id
        }
    })

    return NextResponse.json({
      status: "success",
      message: "New character created successfully",
      data: newCharacter,
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
