import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { UserType, User } from "@prisma/client";

type UserWithRelations = User & {
  candidate: any | null;
  Owner: any | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || typeof credentials.email !== "string") {
          return null;
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            candidate: true,
            Owner: true,
            
          },
        })) as UserWithRelations | null;
        console.log("User: ", user);
        if (!user) {
          return null;
        }

        // If user is a candidate, verify password

        if (
          !credentials.password ||
          typeof credentials.password !== "string" ||
          !user.password
        ) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        console.log("Pasword matched: ", isPasswordValid)
        if (!isPasswordValid) {

          return null;
        }



        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType || UserType.CANDIDATE,
          image: user.image || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add id
        token.userType = user.userType; // Add role
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Attach id
        session.user.userType = token.userType as string; // Attach role
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
