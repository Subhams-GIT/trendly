import type { ServerResponse } from "http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { usersTable } from "../db/schema";
import { randomBytes, randomUUID } from "crypto";
import { ApiError } from "../error/custom_error";
import { eq } from "drizzle-orm";

export async function sign_in(req: customRequest, res: ServerResponse) {
    try {
        const client = dbClient.getInstance();
        const { email, name, token } = req.body;
        if (!email || !name || !token) throw new ApiError("not found", "details incomplete")
        const doesUSerExist = await client.query.usersTable.findFirst({
            where: eq(usersTable.email, email)
        })
        if (doesUSerExist) {
            res.writeHead(200, {
                "content-type": "application/json"
            });
            res.write(JSON.stringify({
                id: doesUSerExist.id,
                email: doesUSerExist.email,
                name: doesUSerExist.name,
            }));
            res.end();
        }
        const user: typeof usersTable.$inferInsert = {
            id: randomUUID(),
            name,
            email,
            password: randomBytes(16).toString("hex"),
            token,
        };
        console.log("reached!")
        await client.insert(usersTable).values(user)
        const savedUser = await client.query.usersTable.findFirst({
            with: {
                email
            }
        })
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.write(JSON.stringify({
            id: savedUser?.id,
            email: savedUser?.email,
            name: savedUser?.name,
        }));
        res.end();
    } catch (error: ApiError | any) {
        console.error(error);
        res.writeHead(500, JSON.stringify({
            message: "cannot signin",
            cause: error instanceof ApiError ? error.cause : error
        }));
        res.end();
    }
}
