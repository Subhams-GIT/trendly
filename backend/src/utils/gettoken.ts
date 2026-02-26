import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { randomBytes } from "node:crypto";

export function getOrCreateAnonToken(req: customRequest, res: ServerResponse): string {
    const cookieHeader = req.headers.cookie;

    let token: string | null = null;

    if (cookieHeader) {
        const cookies = Object.fromEntries(
            cookieHeader.split(";").map(c => {
                const [key, ...v] = c.trim().split("=");
                return [key, v.join("=")];
            })
        );

        token = cookies["trendly_session_id"] ?? null;
    }

    if (!token) {
        token = randomBytes(32).toString("hex");

        res.setHeader(
            "Set-Cookie",
            `trendly_session_id=${token}; HttpOnly; Path=/; SameSite=Lax`
        );
    }

    return token;
}
