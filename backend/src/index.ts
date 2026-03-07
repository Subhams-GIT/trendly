import express from "express"
import { router } from "./Router/router";
// import Redis from "./middleware/rate_limiter";
import { connectRedis } from "./config/redis";
import { disconnect } from "./config/redis";

const server=express();
server.use(express.json())
server.use(router)
connectRedis();

server.listen(3002, "localhost", () => {
  console.log("server running at localhost:3002");
});
