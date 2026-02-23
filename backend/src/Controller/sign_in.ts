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
        console.log(req.body)
        const { email, name } = req.body;
        if (!email.trim() || !name.trim()) throw new ApiError("not found", "details incomplete")
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
        };
        console.log("reached!")
        const savedUser=await client.insert(usersTable).values(user).returning({ id: usersTable.id, email: usersTable.email,
            name: usersTable.name })
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.write(JSON.stringify({
            id: savedUser[0]?.id,
            email: savedUser[0]?.email,
            name: savedUser[0]?.name,
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
