// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    };
    idToken?: string;
    accessToken?: string; // Optional since it may not always exist
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    accessToken?: string;
    idToken?: string;
  }
}
