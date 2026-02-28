import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { poll, pollOption } from "../db/schema";
import { eq } from "drizzle-orm";

export async function get_polls(req: customRequest, res: ServerResponse) { // function to get all polls creted by user
    try {
        const user = req.user;
        if (!user?.id) throw new Error("user id not found!");
        console.log("fetching polls for user:", user.id);
        const client = dbClient.getInstance();
        console.log("reached")
        const polls = await client
            .select()
            .from(poll)
            .leftJoin(poll,eq(poll.userId,user.id))
            .leftJoin(pollOption, eq(pollOption.pollId, poll.id))
            .where(eq(poll.userId, user.id));
        console.log("polls fetched:", polls);
        res.writeHead(200, {
            "content-type": "application/json"
        })
        res.write(JSON.stringify({
            polls
        }))
        res.end();
    } catch (e) {
        console.error("polls not found", e);
        res.writeHead(500, {
            "content-type": "application/json"
        })
        res.write(JSON.stringify({
            message: "polls not found"
        }))
        res.end();
    }
}
