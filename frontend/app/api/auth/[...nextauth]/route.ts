import NextAuth from "next-auth/next"
// @ts-ignore
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Define loose types to avoid build errors if package types are missing
interface LooseUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  [key: string]: any;
}

const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Demo",
      credentials: {},
      authorize: async () => ({
        id: "demo",
        name: "Demo Admin",
        email: "demo@saudi.gov"
      })
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }: { user: LooseUser; account: any }) {
      if (user) {
        try {
          // Sync user to Backend API
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
          const response = await fetch(`${backendUrl}/api/v1/auth/store-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id || user.sub,
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider || 'credentials',
              provider_id: account?.providerAccountId || user.id
            })
          });

          if (!response.ok) {
            console.error("Backend Sync Failed:", await response.text());
          } else {
            console.log("✅ User Synced to Backend");
          }
        } catch (error) {
          console.error("Backend Sync Error:", error);
        }
      }
      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: LooseUser | null }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  trustHost: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
