import type { customRequest } from "../global";
import { type Cookie } from "../types/types";
export function parseCookies(req: customRequest) {
    const list:Cookie = {};
    if(!req.headers.cookie) return ;
    const cookieHeader = JSON.parse(req.headers.cookie);
    console.log({cookieHeader})

    return cookieHeader;
}
