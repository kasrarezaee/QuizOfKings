import roundController from "../controllers/round.controller.js";
import express from "express"

const router = express.Router()

router.route("/")
    .post(roundController.createRound)

router.route("/turn/session_id/:session_id")
    .get(roundController.getTurn)

router.route("/round_id/:round_id")
    .get(roundController.getRound)
    .delete(roundController.deleteRound)

router.route("/session_id/:session_id")
    .get(roundController.getRound)

router.route("/submit")
    .post(roundController.submitAnswer)


export default router


