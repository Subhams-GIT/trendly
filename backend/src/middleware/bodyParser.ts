import type { customRequest } from "../global";
export function bodyParser(req: customRequest): Promise<any> {
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
                    console.log("sdfn")
                    req.body = parsedBody
                }

                resolve(parsedBody);
            } catch (err) {
                reject(err);
            }
        });

        req.on("error", reject);
    });
}
