import type { NextFunction, Request, Response } from "express";
import moment from "moment";
import { getRedis } from "../config/redis";
export async function tokenbasedRateLimiter(_req: Request, res: Response, next: NextFunction) {
    const bucketkey = "bucket"
    const redis = getRedis();

    const capacity = 10

    const interval = 1

    const currentTime = moment().unix();

    const exists = await redis.exists(bucketkey)

    if (!exists) {
        await redis.hmset(bucketkey, {
            capacity: capacity,
            tokens: capacity,
            lastRefillTime: currentTime,
        })
    }
    const info = await redis.hgetall(bucketkey)
    const elapsedTime = currentTime - parseInt(info.lastRefillTime as string)

    const tokensToAdd = elapsedTime * interval;
    const newTokens = Math.min(capacity, parseInt(info.tokens as string) + tokensToAdd);
    await redis.hmset(bucketkey, {
        tokens: newTokens,
        lastRefillTime: currentTime,
    });
    
    if(parseInt(info.tokens as string)>0){
        await redis.hset(bucketkey,'tokens',parseInt(info.tokens as string))
        next();
    }else{
        res.status(429).json({
            sucess:false,
            message:"rate limit exceed"
        })
    }

}
