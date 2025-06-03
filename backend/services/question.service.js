import questionDB from "../db/question.db.js";

class QuestionService {
  createQuestion = async (question) => {
    try {
      return await questionDB.createQuestion(question);
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllQuestions = async () => {
    try {
      return await questionDB.getAllQuestions();
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllQuestionsByCategory = async (category_id) => {
    try {
      return await questionDB.getAllQuestionsByCategory(category_id);
    } catch (err) {
      throw new Error(err);
    }
  };

  deleteAllQuestions = async () => {
    try {
      return await questionDB.deleteAllQuestions();
    } catch (err) {
      throw new Error(err);
    }
  };

  getQuestion = async (id) => {
    try {
      return await questionDB.getQuestion(id);
    } catch (err) {
      throw new Error(err);
    }
  };

  deleteQuestion = async (id) => {
    try {
      return await questionDB.deleteQuestion(id);
    } catch (err) {
      throw new Error(err);
    }
  };

  updateQuestion = async (id, question) => {
    try {
      return await questionDB.updateQuestion(id, question);
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default new QuestionService();
