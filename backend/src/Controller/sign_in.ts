import type { ServerResponse } from "http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { usersTable } from "../db/schema";
import { randomBytes, randomUUID } from "crypto";
import { ApiError } from "../error/custom_error";

export async function sign_in(req:customRequest,res:ServerResponse){
    try {
        const client=dbClient.getInstance();
        const {email,name,token}=req.body;
        if(!email || !name || !token) throw new ApiError("not found","details incomplete")
        const user:typeof usersTable.$inferInsert={
            id:randomUUID(),
            name,
            email,
            password:randomBytes(16).toString("hex"),
            token,
        };
        await client.insert(usersTable).values(user)
    } catch (error:ApiError|any) {
        console.error(error);
        res.writeHead(500,JSON.stringify({
            message:"cannot signin",
            cause:error instanceof ApiError ?error.cause:error
        }));
    }
}