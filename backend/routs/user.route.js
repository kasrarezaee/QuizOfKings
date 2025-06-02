import userController from "../controllers/user.controller.js"
import express from "express"

const router = express.Router()
router.route("/").get(userController.getAllUsers)
.post(userController.createUser)

router.route("/id/:id").get(userController.getUserByID)
.delete(userController.deleteUserByID)

router.route("/username/:username").get(userController.getUserByUserName)


export default router