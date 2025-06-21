import categoryController from "../controllers/category.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";
import isBlock from "../middlewares/isBlock.js";

const router = express.Router();

router.use(verifyToken)
router.use(isBlock)

router
  .route("/")
  .get(allowRoles("admin", "question_designer"), categoryController.getAllCategories)
  .delete(allowRoles("admin"), categoryController.deleteAllCategories)
  .post(allowRoles("admin"), categoryController.createCategory);

router
  .route("/:id")
  .get(allowRoles("admin"), categoryController.getCategory)
  .delete(allowRoles("admin"), categoryController.deleteCategory);

router.route("/random/random").get(categoryController.getRandomCategories)

export default router;
