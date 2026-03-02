import * as http from "http";
import { Router } from "./Router/express-router";
import { healthCheckController } from "./Controller/health-check";
import type { customRequest } from "./global";
import authenticate from "./middleware/auth_middleware";
import { bodyParser } from "./middleware/bodyParser";
import { get_all_polls } from "./Controller/get_all_polls";
import { create_survey, get_Survey } from "./Controller/create_poll_survey";
import { get_specific_Survey } from "./Controller/get_survey";
import { sign_in } from "./Controller/sign_in";
import { ans_survey } from "./Controller/ans_survey";
import { getPoll } from "./Controller/get_poll";

const router = new Router();

const server = http.createServer((req, res) => {
  router.handle(req as customRequest, res);
});

router.useGlobal(bodyParser)
router.post ('/sign-in',sign_in);
router.use("GET","/health",healthCheckController,authenticate)
router.use("GET", "/surveys", get_Survey, authenticate);
router.use("GET", "/survey", get_specific_Survey, authenticate);
router.use("GET", "/polls", get_all_polls, authenticate);
router.use("POST", "/create-survey", create_survey, authenticate);
router.use("POST", "/submit-survey", ans_survey, authenticate);
router.use("GET", "/poll", getPoll, authenticate);

server.listen(3002, "localhost", () => {
  console.log("server running at localhost:3002");
});
