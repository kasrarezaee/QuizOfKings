import sessionController from "../controllers/session.controller.js"
import express from "express"
import verifyToken from "../middlewares/verifyToken.js"
import allowRoles from "../middlewares/allowRoles.js"

const router = express.Router()

router.use(verifyToken)

router.route("/")
    .get(allowRoles("admin"), sessionController.getSessions)

router.route("/finish/:id")
    .post(sessionController.finishSession)

router.route("/session/:id")
    .get(sessionController.getSession)
    .delete(allowRoles("admin"), sessionController.deleteSession)

router.route("/user/:id")
    .get(sessionController.getSessionsByUserID)
    .post(sessionController.createSession)

export default router