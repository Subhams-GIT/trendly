import express from "express"
import { router } from "./Router/router";
const server=express();
server.use(express.json())
server.use(router)

server.listen(3002, "localhost", () => {
  console.log("server running at localhost:3002");
});
