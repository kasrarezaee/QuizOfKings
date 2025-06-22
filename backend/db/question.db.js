import db from "../config/db.js";

const { query, closeConnection } = db;
/*
question_id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CORRECT_ANSWER NOT NULL,
  category_id INT NOT NULL REFERENCES categories(category_id),
  difficulty DIFFICULTY NOT NULL,
  author_id INT NOT NULL REFERENCES users(user_id),
  approval_status APPROVAL_STATUS  DEFAULT 'PENDING',
  moderator_id INT REFERENCES users(user_id)
*/
class QuestionDB {
  createQuestion = async ({
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    category_id,
    difficulty,
    author_id,
  }) => {
    const { rows } = await query(
      `INSERT INTO 
       questions (question_text , option_a , option_b , option_c
       , option_d , correct_answer , category_id , difficulty , author_id)
       VALUES ($1 , $2 , $3 , $4 , $5, $6 , $7 , $8, $9) RETURNING *`,
      [
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        category_id,
        difficulty,
        author_id,
      ]
    );
    return rows;
  };

  getAllQuestions = async () => {
    const { rows } = await query(`SELECT * FROM questions`);
    return rows;
  };

  getAllQuestionsByCategory = async (category_id) => {
    const { rows } = await query(
      `SELECT * FROM questions Q 
                                JOIN categories C on Q.category_id = C.category_id
                                WHERE Q.category_id = $1`,
      [category_id]
    );
    return rows;
  };

  deleteAllQuestions = async () => {
    const { rows } = await query(
      `DELETE FROM questions WHERE question_id IS NOT NULL RETURNING *`
    );
    return rows;
  };

  getQuestion = async (id) => {
    const { rows } = await query(
      `SELECT * FROM questions WHERE question_id = $1`,
      [id]
    );
    return rows;
  };

  deleteQuestion = async (id) => {
    const { rows } = await query(
      `DELETE FROM questions WHERE question_id = $1`,
      [id]
    );
    return rows;
  };

  updateQuestion = async (
    id,
    {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      category_id,
      difficulty,
      approval_status,
      moderator_id
    }
  ) => {
    const { rows } = await query(
      `UPDATE questions SET question_text=$1 , option_a=$2 , option_b=$3 , option_c=$4
       , option_d=$5 , correct_answer=$6, category_id = $7 , difficulty=$8 , approval_status=$9 , moderator_id = $10
       WHERE question_id = $11 RETURNING *`,
      [
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        category_id,
        difficulty,
        approval_status,
        moderator_id,
        id
      ]
    );

    return rows;
  };

  getRandomQuestionByCategory = async (category_id) => {
    const { rows } = await query(`SELECT * FROM questions WHERE category_id = $1 ORDER BY RANDOM() LIMIT 3`
      , [category_id])

    console.log("random ques")
    console.log(rows)
    return rows;
  }
}

export default new QuestionDB();
