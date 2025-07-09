import { prisma } from "@/lib/prisma";
import { User } from "next-auth";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if(user){
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        profile_picture: user?.profile_picture,
      };
    }
    else {
      return null
    }
  } catch (error) {
    console.error("Database error in getUserByEmail:", error);
    throw new Error("Database connection error");
  }
}
