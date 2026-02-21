import type { customRequest } from "../global";
import { type Cookie } from "../types/types";
export function parseCookies(req: customRequest) {
    const list:Cookie = {};
    const cookieHeader = req.headers.cookie;

    cookieHeader?.split(';').forEach((c) => {
        let [name, ...rest] = c.split("=")
        const value = rest.join(`=`).trim();
        if(!name ||!value) return ;
        if (name.trim() && value.trim()) list[name] = decodeURIComponent(value)
    })
    return list;
}
