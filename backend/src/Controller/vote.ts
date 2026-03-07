import type { ServerResponse } from "node:http";
import { dbClient } from "../db/db";
import { poll, pollOption, vote } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import type { Request } from "express";
export async function vote_poll(req: Request, res: ServerResponse) {
    try {
        const { pollID, response , mode } = req.body;

        if (!pollID || !response) {
            throw new Error("Invalid request");
        }

        const client = dbClient.getInstance();

        const pollToVote = await client.query.poll.findFirst({
            where: eq(poll.id, pollID)
        });
        if (!pollToVote || pollToVote.state !== "open") {
            throw new Error("Poll not open");
        }

        let voterId: string;
        if (mode==="authenticated") {
            voterId = req.user?.id??"";
        } else {
            res.writeHead(400);
            res.end("only authentic users can vote for now")
            return ;
        }
        const isAlreadyVoted=await client.query.vote.findFirst({
            where:eq(vote.userId,voterId)
        })
        if(isAlreadyVoted){
             res.writeHead(400);
            res.end("only authentic users can vote for now")
            return ;
        }
        await client.transaction(async (tx) => {
            await tx.insert(vote).values({
                pollId: pollID,
                pollOptionId: response,
                voteMode:mode,
                userId:voterId
            });

            await tx.update(pollOption)
                .set({ voteCount: sql`${pollOption.voteCount} + 1` })
                .where(eq(pollOption.id, response));
        });

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Poll voted successfully" }));

    } catch (error: any) {

        // Handle duplicate vote (unique constraint error)
        if (error?.message?.includes("UNIQUE")) {
            res.writeHead(400, { "content-type": "application/json" });
            return res.end(JSON.stringify({ message: "Already voted" }));
        }

        console.error(error);

        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Error occurred" }));
    }
}
