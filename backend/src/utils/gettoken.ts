import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { randomBytes } from "node:crypto";

export function getOrCreateAnonToken(req: customRequest, res: ServerResponse): string {

    const token = randomBytes(32).toString("hex");

    res.setHeader(
        "Set-Cookie",
        `trendly_session_id=${token}; HttpOnly; Path=/; SameSite=Lax`
    );

    return token;
}
