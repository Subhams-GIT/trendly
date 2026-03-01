import { create_survey, get_Survey } from "../Controller/create_poll_survey";
import { sign_in } from "../Controller/sign_in";
import { parseCookies } from "../utils/cookie";
import authenticate from "../middleware/auth_middleware";
import { bodyParser } from "../middleware/bodyParser";
import { create_poll } from "../Controller/create_poll";
import { ans_survey } from "../Controller/ans_survey";
import { get_all_polls} from "../Controller/get_all_polls";
import { getPoll } from "../Controller/get_poll";
import { get_specific_Survey } from "../Controller/get_survey";
import { vote_poll } from "./vote";

module.exports={
    signin:sign_in,
    authenticate,
    create_poll,
    ans_survey,
    getPoll,
    get_all_polls,
    get_specific_Survey,
    create_survey,
    get_Survey,
    parseCookies,
    bodyParser,
    vote:vote_poll
}
