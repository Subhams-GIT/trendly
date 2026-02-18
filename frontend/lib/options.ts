import NextAuth from "next-auth";
import googleprovider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth";
export const options:NextAuthOptions = {
  providers: [
    googleprovider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, 
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks:{
    async signIn({ user, account, profile, email, credentials}){
        if(account?.provider==='google'){
          
        }
        return true;
    },
    async session({ session, user, token }){
        return session;
    },
    async jwt({token}){
        return token
    }
  },
  pages:{
    signIn:'/auth/signin'
  }
}
