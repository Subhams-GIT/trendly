import type { Request, Response } from "express";
import { dbClient } from "../db/db";
import { survey } from "../db/schema";
import { eq } from "drizzle-orm";

export async function change_state(req: Request, res: Response) {

    try {
        const user = req.user?.id;
        const { id } = req.body.id;
        if (!id) throw new Error("invalid request");
        const client = dbClient.getInstance();

        const is_updated = await client.update(survey).set({ state: "closed" }).where(eq(survey.id, id))
        if (is_updated.rowsAffected > 0) {
            res.status(200).json({
                message: "updated the survey to closed!"
            })
        }
        else{
            res.json({
                message:"not updated the rows!"
            })
        }
    } catch (error) {
        console.log(error)
        if(error instanceof Error){
            res.json({
                error:error.message
            })
            return
        }
        res.json({
            message:"error ocurred while updating the state "
        })
    }

}
