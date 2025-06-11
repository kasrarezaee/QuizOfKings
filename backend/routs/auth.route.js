import authController from "../controllers/auth.controller.js";
import express from "express"

const router = express.Router()

router.route("/signup").post(authController.signUp)
router.route("/login").post(authController.login)
router.route("/refresh-token").post(authController.refresh_token)


export default router