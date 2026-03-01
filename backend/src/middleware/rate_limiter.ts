import { createClient, type RedisClientType } from "redis";

class Redis {
    private static instance: Redis;
    private static client: RedisClientType;

    private constructor() { }

    public init(url: string) {
        Redis.client = createClient({ url });
        return Redis.client;
    }
    static getInstance() {
        if (!Redis.instance) Redis.instance = new Redis();
        return Redis.instance;
    }
    public getRedisClient() {
        return Redis.client;
    }
}


export class TokenBucket {

    public capacity
    public tokens
    private redis_client
    constructor(capacity: number, fillPerSecond: number) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.redis_client=Redis.getInstance();
    }

    addToken() {
        if (this.tokens < this.capacity) {
            this.tokens += 1;
        }
    }

    take() {
        if (this.tokens > 0) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }
}

export default Redis.getInstance();
