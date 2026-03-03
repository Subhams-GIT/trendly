import express from "express"
import { sign_in } from "../Controller/sign_in";
import authenticate from "../middleware/auth_middleware";
import { create_survey, get_Survey } from "../Controller/create_poll_survey";
import { get_specific_Survey } from "../Controller/get_survey";
import { healthCheckController } from "../Controller/health-check";
import { get_all_polls } from "../Controller/get_all_polls";
import { ans_survey } from "../Controller/ans_survey";
import { create_poll } from "../Controller/create_poll";

export const router=express.Router();
router.post ('/sign-in',sign_in);
router.post("/sign-in", sign_in)
router.get("/health", authenticate, healthCheckController)
router.get("/surveys", authenticate, get_Survey)
router.get("/survey", authenticate, get_specific_Survey)
router.get("/polls", authenticate, get_all_polls)
router.post("/create-survey", authenticate, create_survey)
router.post("/submit-survey", authenticate, ans_survey)
router.post("/create-poll", authenticate, create_poll)
