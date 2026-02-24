
import { decode, type JWT } from 'next-auth/jwt';
import type { customRequest, JWTPayload } from '../global';
export default async function authenticate(req:customRequest, cookie: any): Promise<JWTPayload|null> {
    try {
        const session_token = cookie["next-auth.session-token"]
            || cookie["__Secure-next-auth.session-token"]; // for production

        if (!session_token) return null;
        const payload=await decode({token:session_token,secret:process.env.NEXTAUTH_SECRET!}) as unknown as JWTPayload;
        if (!payload) return null;
        req.user=payload;
        return payload;
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}
