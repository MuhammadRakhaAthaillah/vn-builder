import NextAuth, { User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./model";
import bcrypt from "bcrypt"
// import { JWT } from "next-auth/jwt";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) return null;

          const user = await getUserByEmail(credentials.email as string);

          if (!user) {
            console.error("User not found");
            throw new Error("Invalid credentials");
          }

          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password as string,
          );

          if (!isMatch) {
            console.error("Invalid password");
            throw new Error("Invalid credentials");
          }
          return {
            ...user,
            password: null,
          };
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Invalid credentials"
          ) {
            console.error("Authorization error:", error.message);
            throw new Error("Invalid credentials"); // Tetap informatif
          }

          console.error("Server error:", error);
          throw new Error("Server error, please try again later."); // General server error
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async jwt({ token, account, user, session, trigger }) {
      if (account) {
        token.providerAccountId = account.providerAccountId;
      }
      if (user) {
        token.id = user.id;
        token.profile_picture = user.profile_picture || null;
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      return true;
    },

    async session({ session, token }): Promise<Session> {
      session.user.id = token.id as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
});
