import type { ServerResponse } from "http";
import type { customRequest } from "../global";
import querystring from 'querystring'
export function bodyParser(req: customRequest,res:ServerResponse): Promise<any> {
    const contentType: string = req.headers["content-type"] as string;
    return new Promise((resolve, reject) => {
        let rawBody: any = [];

        req.on("data", (chunk) => {
            rawBody.push(chunk);
        });

        req.on("end", () => {
            try {
                let parsedBody: any = {};
                if (contentType.includes("application/json")) {
                    parsedBody = JSON.parse(Buffer.concat(rawBody).toString());
                    req.body = parsedBody
                }
                else if (contentType.includes("multipart/formData")){
                    parsedBody=querystring.parse(rawBody);
                    req.body=parsedBody;
                }
                resolve(parsedBody);
            } catch (err) {
                reject(err);
                return ;
            }
        });

        req.on("error", reject);
    });
}
