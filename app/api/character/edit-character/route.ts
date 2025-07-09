import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, response: any) {
  try {
    let reqBody = await request.json();
    const session = await auth()

    const character = await prisma.character.update({
        data: {
            name: reqBody.name,
            desc: reqBody.desc || null,
            picture: reqBody.picture || null,
            creatorId: session?.user.id
        },
        where:{
          id: reqBody.id
        }
    })

    return NextResponse.json({
      status: "success",
      message: "character edited successfully",
      data: character,
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
