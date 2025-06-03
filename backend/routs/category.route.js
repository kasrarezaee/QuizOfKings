import categoryController from "../controllers/category.controller.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .delete(categoryController.deleteAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .delete(categoryController.deleteCategory);

export default router;
