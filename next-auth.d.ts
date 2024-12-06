import NextAuth, {DefaultSession} from "next-auth";
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      role: string;
    };
  }
}
