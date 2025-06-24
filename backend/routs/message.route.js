import messageController from "../controllers/message.controller.js"
import express from "express"

const router = express.Router()

router.route("/")
    .post(messageController.createMessage)

router.route("/session/:session_id")
    .get(messageController.getMessages)

router.route("/:message_id")
    .post(messageController.updateMessage)
    .delete(messageController.deleteMessage)

export default router