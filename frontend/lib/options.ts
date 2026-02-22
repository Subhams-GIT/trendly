import googleprovider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { apiclient } from "@/api_client/axios";
import { AxiosError, AxiosResponse } from "axios";
import { JWT } from "next-auth/jwt";

async function revoke_token(token: JWT) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const options: NextAuthOptions = {
  providers: [
    googleprovider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (account?.provider === "google") {
          const newuser = await apiclient.post("/sign-in", {
            name: profile?.name,
            email: profile?.email,
          });
          console.log(newuser)
          debugger;
          user.id = newuser.data.id;
          user.email = newuser.data.email;
          user.name = newuser.data.name;
        }
        return true;
      } catch (error: AxiosResponse | any | AxiosError) {
        console.error(error);
        return false;
      }
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.email = token.email
        session.user.name = token.name
        session.user.id = token.id as string
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
  },
  pages: {
    signIn: '/signin'
  }
};
