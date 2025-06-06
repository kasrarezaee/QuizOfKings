import db from "../config/db.js"
import categoryDb from "./category.db.js"
const { query, closeConnection } = db

class SessionDB {

    createSession = async (player1_id) => {
        const { random_user } = await query(`SELECT * FROM users ORDER BY RAND() LIMIT 1`)
        const { sessionCreated } = await query(`INSERT INTO sessions (player1_id , player2_id) 
                                        VALUES($1 , $2) RETURNING *`
            , [player1_id, parseInt(random_user[0])])

        const result = sessionCreated
        return result;
    }

    isSessionComplete = async (session_id) => {
        // Count total answered round_questions for the session
        const { rows } = await query(`
          SELECT COUNT(*) AS answered_count
          FROM rounds r
          JOIN round_questions rq ON rq.round_id = r.round_id
          WHERE r.session_id = $1
            AND rq.player1_answer IS NOT NULL
            AND rq.player2_answer IS NOT NULL
        `, [session_id]);

        // Total questions expected = 3 rounds × 3 questions = 9
        const answeredCount = parseInt(rows[0].answered_count);
        if (answeredCount === 9) {
            await query(`UPDATE sessions SET session_status = 'COMPLETED', end_time = NOW() WHERE session_id = $1`, [session_id]);
            return true;
        }

        return false;
    };


}