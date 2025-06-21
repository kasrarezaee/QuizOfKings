import moderationController from "../controllers/moderation.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";
import isBlock from "../middlewares/isBlock.js";

const router = express.Router();

router.use(verifyToken)
router.use(isBlock)

router
    .route("/")
    .get(allowRoles("admin"), moderationController.getModerations)
    .post(allowRoles("admin", "moderator"), moderationController.createModeration);

export default router;
