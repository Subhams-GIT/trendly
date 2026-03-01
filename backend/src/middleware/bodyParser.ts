import type { ServerResponse } from "http";
import type { customRequest } from "../global";
import querystring from 'querystring'
import type { next } from "../Router/express-router";
export function bodyParser(req: customRequest, res: ServerResponse, next: next): Promise<any> {
    const contentType: string = req.headers["content-type"] as string;
    console.log("Content-Type:", contentType);

    return new Promise((resolve, reject) => {
        let rawBody: any = [];
        if (contentType === undefined) {
            resolve({});
            next();
        }
        req.on("data", (chunk) => {
            rawBody.push(chunk);
        });

        req.on("end", () => {
            try {
                let parsedBody: any = {};
                if (contentType.includes("application/json")) {
                    const bodyString = Buffer.concat(rawBody).toString().trim();
                    // only parse if the string is non-empty
                    req.body = bodyString ? JSON.parse(bodyString) : {};
                }
                else if (contentType.includes("multipart/formData")) {
                    parsedBody = querystring.parse(rawBody);
                    req.body = parsedBody;
                }
                console.log(parsedBody)
                resolve(parsedBody);
                next();
            } catch (err) {
                reject(err);
                return;
            }
        });

        req.on("error", reject);
    });
}
