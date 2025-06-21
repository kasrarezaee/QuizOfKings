import roundController from "../controllers/round.controller.js";
import express from "express"
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";
import isBlock from "../middlewares/isBlock.js";

const router = express.Router()

router.use(verifyToken)
router.use(isBlock)

router.route("/")
    .post(roundController.createRound)

router.route("/turn/session_id/:session_id")
    .get(roundController.getTurn)

router.route("/round_id/:round_id")
    .get(roundController.getRound)
    .delete(allowRoles("admin"), roundController.deleteRound)

//router.route("/session_id/:session_id")
//    .get(roundController.getRound)

router.route("/submit")
    .post(roundController.submitAnswer)


export default router


