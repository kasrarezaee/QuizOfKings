import sessionController from "../controllers/session.controller.js"
import express from "express"

const router = express.Router()

router.route("/")
    .get(sessionController.getAllSessions)
    .post(sessionController.createSession)
    .delete(sessionController.deleteAllSessions)

router.route("/:id")
    .get(sessionController.getSession)