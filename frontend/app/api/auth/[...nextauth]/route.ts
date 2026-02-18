import { options } from "@/lib/options";
import NextAuth, { NextAuthOptions } from "next-auth"

export const handler:NextAuthOptions = NextAuth(options)

export {handler as GET ,handler as POST};