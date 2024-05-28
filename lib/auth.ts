import { FirestoreAdapter } from "@auth/firebase-adapter";
import GoogleProvider from "next-auth/providers/google";
import { cert } from "firebase-admin/app";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY!.replaceAll("\\n", "\n"),
    }),
  }) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.userId as string;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.userId = account.providerAccountId;
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
};