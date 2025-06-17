import categoryController from "../controllers/category.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";

const router = express.Router();

router.use(verifyToken)
router.use(allowRoles("admin"))

router
  .route("/")
  .get(categoryController.getAllCategories)
  .delete(categoryController.deleteAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .delete(categoryController.deleteCategory);

router.route("/random/random").get(categoryController.getRandomCategories)

export default router;
