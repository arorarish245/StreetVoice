import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
    if (account && user) {
      token.id = user.id;
      token.email = user.email;
      if (account.access_token) {
        token.accessToken = account.access_token; 
      }
      if (account.id_token) {
        token.idToken = account.id_token; 
      }
    }
    return token;
  },

  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.accessToken = token.accessToken as string; 
      session.idToken = token.idToken as string; 
    }
    return session;
  },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };