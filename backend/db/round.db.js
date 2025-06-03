import db from "../config/db.js"
import categoryDb from "./category.db.js"
import questionDb from "./question.db"

const { query, closeConnection } = db

class RoundDB {
    createRound = async (session_id, category_id) => {
        const { roundCreated } = await query(`INSERT INTO rounds(session_id , category_id) VALUES ($1 , $2) 
                                        RETURNING *`
            , [session_id, category_id])

        const { randomQuestion } = await questionDb.getRandomQuestionByCategory(category_id)
        //insert these questions into round_question
        const result = { roundCreated, randomQuestion }
        return result;
    }

    isRoundComplete = async (round_id, round_number) => {
        const { rows } = await query(`
          SELECT COUNT(*) AS answered_count
          FROM rounds r
          JOIN round_questions rq ON rq.round_id = r.round_id
          WHERE r.round_id = $1 AND r.round_number=$2
            AND rq.player1_answer IS NOT NULL
            AND rq.player2_answer IS NOT NULL
        `, [round_id, round_number]);

        const answeredCount = parseInt(rows[0].answered_count);
        if (answeredCount === 3) {
            //await query(`UPDATE rounds SET round_number=$1 WHERE round_id=$2`, [round_number + 1, round_id]);
            return true;
        }

        return false;
    };

    submitAnswer = async (user_id, round_id, question_id,) => {
        //update round_question based on which player answer to which question
        const { round_number } = await query(`SELECT round_number FROM rounds WHERE round_id = $1`, [round_id])
        if (this.isRoundComplete(round_id, round_number)) {
            await query(`UPDATE rounds SET round_number=$1 WHERE round_id=$2`, [round_number + 1, round_id]);
        }

    }

}