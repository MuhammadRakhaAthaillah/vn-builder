import NextAuth from "next-auth";
// import { ExtendedUser } from "@/lib/auth";
import { UserType } from "@/app/api/user/data";
import { DefaultJWT, DefaultUser } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      profile_picture?: string;
      name?: string;
      email?: string;
    };
    // idToken: string;
  }
  interface User extends DefaultUser {
    password?: string | null;
    profile_picture?: string | null
  }

  // interface User extends DefaultUser, UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    // accessToken: string;
    // idToken: string;
  }
}
