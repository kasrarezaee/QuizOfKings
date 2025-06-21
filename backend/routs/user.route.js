import userController from "../controllers/user.controller.js"
import verifyToken from "../middlewares/verifyToken.js"
import express from "express"
import allowRoles from "../middlewares/allowRoles.js"
import isBlock from "../middlewares/isBlock.js"

const router = express.Router()


router.use(verifyToken)
router.use(isBlock)
router.route("/").get(allowRoles("admin"), userController.getAllUsers)
    .post(userController.createUser)

router.route("/id/:id").get(userController.getUserByID)
    .delete(allowRoles("admin"), userController.deleteUserByID)
    .post(userController.updateUser)

router.route("/email/:email").get(userController.getUserByEmail)

router.route("/check/:email/:username").get(userController.checkUserExists)

router.route("/block/:id")
    .post(allowRoles("admin"), userController.blockUser)
    .delete(allowRoles("admin"), userController.unblockUser)

router.route("/role/:user_id/:role_id")
    .post(allowRoles("admin"), userController.assignRole)
    .delete(allowRoles("admin"), userController.deleteRole)

router.route("/role/:user_id").get(allowRoles("admin"), userController.getUserRoles)

router.route("/username/:username").get(userController.getUserByUserName)


export default router