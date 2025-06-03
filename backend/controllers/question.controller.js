import questionService from "../services/question.service.js";

class QuestionController {
  createQuestion = async (req, res) => {
    const question = req.body;
    const result = await questionService.createQuestion(question);
    res.status(200).json(result);
  };

  getAllQuestions = async (req, res) => {
    const result = await questionService.getAllQuestions();
    res.status(200).json(result);
  };

  getAllQuestionsByCategory = async (req, res) => {
    const { category_id } = req.params;
    console.log(category_id);
    const result = await questionService.getAllQuestionsByCategory(category_id);
    res.status(200).json(result);
  };

  deleteAllQuestions = async (req, res) => {
    const result = await questionService.deleteAllQuestions();
    res.status(200).json({
      status: "success",
    });
  };

  getQuestion = async (req, res) => {
    const { id } = req.params;
    const result = await questionService.getQuestion(id);
    res.status(200).json(result);
  };

  deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const result = await questionService.deleteQuestion(id);
    res.status(200).json(result);
  };

  updateQuestion = async (req, res) => {
    const { id } = req.params;
    const question = req.body;
    const result = await questionService.updateQuestion(id, question);
    res.status(200).json(result);
  };
}

export default new QuestionController();
