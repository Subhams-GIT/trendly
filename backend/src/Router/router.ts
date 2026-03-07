import express from "express"
import { sign_in } from "../Controller/sign_in";
import authenticate from "../middleware/auth_middleware";
import { create_survey, get_Survey } from "../Controller/create_poll_survey";
import { get_specific_Survey } from "../Controller/get_survey";
import { healthCheckController } from "../Controller/health-check";
import { get_all_polls } from "../Controller/get_all_polls";
import { ans_survey } from "../Controller/ans_survey";
import { create_poll } from "../Controller/create_poll";
import { tokenbasedRateLimiter } from "../middleware/rate_limiter";
// import response from "../Controller/response";
import response_survey from "../Controller/response";
import {analyse} from "../Controller/analyse";
import { vote_poll } from "../Controller/vote";

export const router=express.Router();

router.use(tokenbasedRateLimiter);
router.post("/sign-in", sign_in)

router.get("/health", healthCheckController)
router.get("/surveys", authenticate, get_Survey) // get the surveys for the creator
router.get("/survey", authenticate, get_specific_Survey) // get a survey for the responder
router.get("/polls", authenticate, get_all_polls) // get polls for creator
router.post("/create-survey", authenticate, create_survey) //create a survey
router.post("/submit-survey", authenticate, ans_survey) // ans a survey
router.post("/create-poll", authenticate, create_poll) // create a poll
router.get("/responses",authenticate,response_survey) // get the responses for each survey
router.get("/surveys/analyse", authenticate,analyse)
router.post('/vote',authenticate,vote_poll)
