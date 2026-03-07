import ioredis from "ioredis"


let redis: ioredis
export function getRedis(): ioredis {
    if (!redis) {
        redis = new ioredis(process.env.REDIS_URL!, {
            maxRetriesPerRequest: null,
            lazyConnect: true,
        })

    redis.on('connect', () => {
        console.log('Redis connected');
    });

    redis.on('error', (err) => {
        console.error('Redis error:', err.message);
    });

    }

    return redis;
}

export async function connectRedis(){
    const redis=getRedis()
    try {
        await redis.connect();
    } catch (error) {
        if ((error as Error).message?.includes('already')) return;
        console.error(error);

    }
}

export async function disconnect(){
    if(redis){
        redis.quit();
    }
}
