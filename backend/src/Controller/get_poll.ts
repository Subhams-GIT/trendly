import type { ServerResponse } from "node:http";
import { dbClient } from "../db/db";
import { eq } from "drizzle-orm";
import { poll, pollOption } from "../db/schema";
import type { Request } from "express";


export const getPoll = async (req: Request, res: ServerResponse) => {
    try {
        const id = req.query.p

        if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Poll ID is required" }));
            return;
        }
        const client = dbClient.getInstance();

        const res_poll = await client.select().from(poll).where(eq(poll.id, id as string)).leftJoin(pollOption, eq(pollOption.pollId, poll.id))

        if (!res_poll) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Poll not found" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(res_poll));
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};
