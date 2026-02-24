import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { poll, pollOption, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import type { pollOption as po ,visibility as v} from "../types/types";
export async function create_poll(req: customRequest, response: ServerResponse) {
    try {
        const user=req.user;
        if(!user?.id) throw new Error("user id not found!");
        const client = dbClient.getInstance();
        const { statement, expiry, state, visibility, voteMode, options } = req.body;

        if (!Array.from(req.body)) throw new Error("cannot create");
        const doesUserExist = await client.query.usersTable.findFirst({
            where: eq(usersTable.id, req.user?.id as string)
        })
        if (!doesUserExist) {
            response.writeHead(500, {
                'content-type': 'application/json'
            })
            response.write(JSON.stringify({
                message: "user not found"
            }))
            response.end()
        } else {
            if(visibility=="public")
            client.transaction(async tx => {
                const saved_poll: typeof poll.$inferInsert = {
                    statement,
                    expiry:new Date(Date.now() + expiry),
                    state,
                    visibility,
                    voteMode,
                    userId: doesUserExist.id
                }
                const polls = await tx.insert(poll).values(saved_poll).returning({ id: poll.id });
                const poll_options: po[] = options.map((o:string) => ({
                    pollId: polls[0]?.id,
                    data: o,
                }));
                console.log(poll_options)
                const inserted_options = await tx.insert(pollOption).values(poll_options);
                console.log(inserted_options);
            })
        }
        response.writeHead(200, {
           "content-type":"application/json"
        })
        response.write(JSON.stringify({
            message:"poll created!"
        }))
        response.end();
    } catch (error) {
        console.error("poll not created",error);
        response.writeHead(500, {
            message: error as string
        })
        response.end();
    }
}
