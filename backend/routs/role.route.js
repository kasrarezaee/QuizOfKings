import express from "express";
import roleController from "../controllers/role.controller.js";

const router = express.Router();

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
