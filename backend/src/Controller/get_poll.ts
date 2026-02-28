import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { eq } from "drizzle-orm";
import { poll, pollOption } from "../db/schema";


export const getPoll = async (req: customRequest, res: ServerResponse) => {
    try {
        const id = req.queryparams.get("p");

        if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Poll ID is required" }));
            return;
        }
        const client=dbClient.getInstance();
        // TODO: Replace with your database query
        const res_poll = await client.select().from(poll).where(eq(poll.id,id)).leftJoin(pollOption,eq(pollOption.pollId,poll.id))

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
