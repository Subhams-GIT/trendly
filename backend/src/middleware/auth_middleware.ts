import * as jose from 'jose'
import { decode } from 'next-auth/jwt';
export default async function authenticate(cookie: any): Promise<boolean> {
    try {
        const session_token = cookie["next-auth.session-token"]
            || cookie["__Secure-next-auth.session-token"]; // for production

        if (!session_token) return false;
        console.log(session_token)
        const payload=await decode({token:session_token,secret:process.env.NEXTAUTH_SECRET!});
        console.log({payload})
        if (!payload) return false;

        return true;
    } catch (error) {
        console.error("Auth error:", error);
        return false;
    }
}
