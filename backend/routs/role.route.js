import express from "express";
import roleController from "../controllers/role.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";

const router = express.Router();

router.use(verifyToken)
router.use(allowRoles("admin"))

router
  .route("/")
  .get(roleController.getAllRoles)
  .delete(roleController.deleteAllRoles)
  .post(roleController.createRole);
router
  .route("/:id")
  .get(roleController.getRole)
  .delete(roleController.deleteRole);

export default router;
