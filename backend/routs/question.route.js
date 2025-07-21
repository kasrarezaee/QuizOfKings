import questionController from "../controllers/question.controller.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import allowRoles from "../middlewares/allowRoles.js";
import isBlock from "../middlewares/isBlock.js";

const router = express.Router();

router.use(verifyToken)
router.use(isBlock)

router
  .route("/")
  .get(allowRoles("moderator", "admin"), questionController.getAllQuestions)
  .delete(allowRoles("admin"), questionController.deleteAllQuestions)
  .post(allowRoles("moderator", "admin", "question_designer"), questionController.createQuestion);

router
  .route("/:id")
  .get(questionController.getQuestion)
  .delete(allowRoles("admin"), questionController.deleteQuestion)
  .post(allowRoles("moderator", "admin"), questionController.updateQuestion);

router
  .route("/category/:category_id")
  .get(allowRoles("moderator", "admin"), questionController.getAllQuestionsByCategory);

router.route("/random/:id").get(questionController.getRandomQuestionByCategory)
export default router;
