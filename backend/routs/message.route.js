import messageController from "../controllers/message.controller.js"
import express from "express"

const router = express.Router()

router.route("/:sender_id/:receiver_id")
    .post(messageController.createMessage)
    .get(messageController.getMessages)
router.route("/:message_id")
    .post(messageController.updateMessage)
    .delete(messageController.deleteMessage)

export default router