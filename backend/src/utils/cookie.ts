import type { customRequest } from "../global";
export function parseCookies(req: customRequest) {
    if(!req.headers.cookie) return ;
    const cookieHeader = JSON.parse(req.headers.cookie);
    console.log({cookieHeader})

    return cookieHeader;
}
