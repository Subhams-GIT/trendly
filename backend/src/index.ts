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

router.useMiddleware(bodyParser)
router.useMiddleware(authenticate);
router.use("/health", healthCheckController);
router.use("/surveys",get_Survey);
router.use('/survey/:s',get_specific_Survey)
router.use("/polls",get_all_polls)
router.use("/crete-survey",create_survey);
router.use('/sign-in',sign_in);
router.use('/submit-survey',ans_survey);
router.use('/poll',getPoll);

server.listen(3002, "localhost", () => {
  console.log("server running at localhost:3002");
});
