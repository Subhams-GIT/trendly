import dotenv from "dotenv"
import { decode, type JWT } from 'next-auth/jwt';
import type { customRequest, JWTPayload } from '../global';
import type { ServerResponse } from "http";
import { parseCookies } from "../utils/cookie";
import type { next } from "../Router/express-router";

dotenv.config();
export default async function authenticate(req:customRequest,res:ServerResponse,next:next): Promise<JWTPayload|null> {
    try {
        const cookie=parseCookies(req)
        const session_token = cookie["next-auth.session-token"]
            || cookie["__Secure-next-auth.session-token"]; // for production
        console.log("reached auth")
        if (!session_token) return null;
        const payload=await decode({token:session_token,secret:process.env.NEXTAUTH_SECRET!}) as unknown as JWTPayload;
        console.log({payload})
        if (!payload) return null;
        req.user=payload;
        next(req,res);
        return payload;
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}
