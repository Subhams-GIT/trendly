import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { poll, pollOption, private_users_poll, usersTable } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import type { pollOption as po, visibility as v } from "../types/types";
import { randomBytes } from "node:crypto";
export async function create_poll(req: customRequest, response: ServerResponse) {
    try {
        const user = req.user;
        if (!user?.id) throw new Error("user id not found!");
        const client = dbClient.getInstance();
        const { statement, expiry, state, visibility, options, allowedUsers } = req.body;

        if (Array.from(req.body).map(e => e != null).includes(false)) throw new Error("cannot create");
        {
            client.transaction(async tx => {

                const saved_poll: typeof poll.$inferInsert = {
                    statement,
                    expiry: new Date(Date.now() + expiry),
                    state,
                    visibility,
                    userId: user.id
                }
                const polls = await tx.insert(poll).values(saved_poll).returning({ id: poll.id });
                if(visibility == "private" && allowedUsers.length > 0){
                    const users = await tx
                        .select({ id: usersTable.id, email: usersTable.email })
                        .from(usersTable)
                        .where(inArray(usersTable.email, allowedUsers));

                    if (users.length === 0) {
                        throw new Error("No valid users found");
                    }

                    const allowedEntries = users.map(user => ({
                        pollId: polls[0]?.id as string,
                        userId: user.id,
                        token: randomBytes(16).toString("hex")
                    }));
                    await tx.insert(private_users_poll).values(allowedEntries);
                }
                const poll_options: po[] = options.map((o: string) => ({
                    pollId: polls[0]?.id,
                    data: o,
                }));
                console.log(poll_options)
                const inserted_options = await tx.insert(pollOption).values(poll_options);
                console.log(inserted_options);
            })
        }
        response.writeHead(200, {
            "content-type": "application/json"
        })
        response.write(JSON.stringify({
            message: "poll created!"
        }))
        response.end();
    } catch (error) {
        console.error("poll not created", error);
        response.writeHead(500, {
            message: error as string
        })
        response.end();
    }
}

export async function get_polls(req: customRequest, res: ServerResponse) { // function to get all polls creted by user
    try {
        const user = req.user;
        if (!user?.id) throw new Error("user id not found!");
        const client = dbClient.getInstance();
        const doesUserExist = await client.query.usersTable.findFirst({
            where: eq(usersTable.id, req.user?.id as string)
        })
        if (!doesUserExist) {
            res.writeHead(500, {
                'content-type': 'application/json'
            })
            res.write(JSON.stringify({
                message: "user not found"
            }))
            res.end()
        }
        const polls = await client.query.poll.findMany({
            where: eq(poll.userId, user.id)
        })
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
