import userController from "../controllers/user.controller.js"
import verifyToken from "../middlewares/verifyToken.js"
import verifyAdmin from "../middlewares/verifyAdmin.js"
import express from "express"

const router = express.Router()


router.use(verifyToken)

router.route("/").get(userController.getAllUsers)
    .post(userController.createUser)

router.route("/id/:id").get(userController.getUserByID)
    .delete(verifyAdmin, userController.deleteUserByID).post(userController.updateUser)

router.route("/email/:email").get(userController.getUserByEmail)

router.route("/check/:email/:username").get(userController.checkUserExists)

router.route("/block/:id").post(userController.blockUser).delete(userController.unblockUser)

router.route("/role/:user_id/:role_id").post(userController.assignRole).delete(userController.deleteRole)

router.route("role/:user_id").get(userController.getUserRoles)

router.route("/username/:username").get(userController.getUserByUserName)


export default router