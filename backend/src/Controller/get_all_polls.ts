import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { poll, pollOption } from "../db/schema";
import { eq } from "drizzle-orm";
import { type FlatPoll,type NestedPoll } from "../types/types";

export async function get_all_polls(req: customRequest, res: ServerResponse) { // function to get all polls creted by user
    try {
        const user = req.user;
        if (!user?.id) throw new Error("user id not found!");
        console.log("fetching polls for user:", user.id);
        const client = dbClient.getInstance();
        console.log("reached")
        const allPolls: FlatPoll[] = await client
            .select({
                pollId: poll.id,
                statement: poll.statement,
                pollOptionId: pollOption.id,
                optionData: pollOption.data,
                voteCount: pollOption.voteCount,
            })
            .from(poll)
            .leftJoin(pollOption, eq(pollOption.pollId, poll.id))
            .where(eq(poll.userId, user.id));
        const nestedPolls: NestedPoll[] = allPolls.reduce<NestedPoll[]>((acc, row) => {
            let poll = acc.find(p => p.id === row.pollId);

            if (!poll) {
                poll = {
                    id: row.pollId,
                    statement: row.statement,
                    options: [],
                };
                acc.push(poll);
            }
            if (row.pollOptionId) {
                poll.options.push({
                    id: row.pollOptionId,
                    data: row.optionData ?? "",
                    voteCount: row.voteCount,
                });
            }
            return acc;
        }, []);
        res.writeHead(200, {
            "Content-type": "application/json"
        })
        res.write(JSON.stringify({
            polls: nestedPolls
        }))
        res.end();
    } catch (e) {
        console.error("polls not found", e);
        res.writeHead(500, {
            "Content-type": "application/json"
        })
        res.write(JSON.stringify({
            message: "polls not found"
        }))
        res.end();
    }
}
