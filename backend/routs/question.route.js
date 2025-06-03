import questionController from "../controllers/question.controller.js";
import express from "express";

const router = express.Router();
router
  .route("/")
  .get(questionController.getAllQuestions)
  .delete(questionController.deleteAllQuestions)
  .post(questionController.createQuestion);

router
  .route("/:id")
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion)
  .post(questionController.updateQuestion);

router
  .route("/category/:category_id")
  .get(questionController.getAllQuestionsByCategory);

export default router;
