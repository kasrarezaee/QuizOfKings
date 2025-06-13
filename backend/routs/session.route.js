import sessionController from "../controllers/session.controller.js"
import express from "express"

const router = express.Router()

router.route("/")
    .get(sessionController.getSessions)

router.route("/session/:id")
    .get(sessionController.getSession)
    .delete(sessionController.deleteSession)

router.route("/user/:id")
    .get(sessionController.getSessionsByUserID)
    .post(sessionController.createSession)

export default router