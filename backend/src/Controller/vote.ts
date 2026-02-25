// vote -> identify using the link
// public -> generate a url which encodees the creator data
// private -> generate a token or use regex for checking the user

import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { eq, sql } from "drizzle-orm";
import { vote, usersTable, pollOption } from "../db/schema";

export async function vote_poll(req: customRequest, res: ServerResponse) {
    try {
        const { pollID, response } = req.body;
        const user = req.user?.id;
        if (!user) throw new Error("invalid user ");
        const client = dbClient.getInstance();

        const doesuser_exist = await client.query.usersTable.findFirst({
            where: eq(usersTable.id, user)
        })
        if (!doesuser_exist) throw new Error("user not found!");

        await client.transaction(async tx => {
            const poll_vote: typeof vote.$inferInsert = {
                pollId: pollID,
                pollOptionId: response.id,
                userId: user,
            }
            await tx.insert(vote).values(poll_vote)
            await tx.update(pollOption).set({ voteCount: sql`${pollOption.voteCount} + 1` }).where(eq(pollOption.id, pollID))
        })

        res.writeHead(200, {
            'content-type': "application/json"
        })
        res.write(JSON.stringify({
            message: "poll voted"
        }))
    } catch (error) {
        console.error(error)
        res.writeHead(200, {
            'content-type': "application/json"
        })
        res.write(JSON.stringify({
            message: "error occured"
        }))
    }
}
