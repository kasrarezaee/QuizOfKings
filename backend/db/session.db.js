import db from "../config/db.js"
import categoryDb from "./category.db.js"
const { query, closeConnection } = db

class SessionDB {

    createSession = async (player1_id) => {
        const { rows } = await query(`SELECT * FROM users ORDER BY RANDOM() LIMIT 1`)

        await query(`INSERT INTO sessions (player1_id , player2_id) 
                                       VALUES($1 , $2)`
            , [player1_id, parseInt(rows[0].user_id)])


        const { rows: sessionCreated } = await query(`
                SELECT s.session_id , us.username , us.email 
                FROM sessions s  
                JOIN users u ON u.user_id = s.player1_id
                JOIN users us ON us.user_id = s.player2_id
                WHERE s.player1_id = $1 AND s.player2_id = $2
                ORDER BY s.session_id DESC
                LIMIT 1
              `, [player1_id, parseInt(rows[0].user_id)]);


        const result = sessionCreated

        return result;
    }

    finishSession = async (session_id) => {
        const { rows: rounds } = await query(`SELECT * FROM sessions s 
                                            JOIN rounds r ON r.session_id = s.session_id
                                            WHERE s.session_id = $1`
            , [session_id])

        const player1_id = rounds[0].player1_id
        const player2_id = rounds[0].player2_id
        let game_result = 0;
        for (let round of rounds) {
            if (round.round_status == 'ACTIVE') {
                return -1;
            }
            console.log(round.winner_id)
            if (round.winner_id == player1_id) {
                game_result++
            } else if (round.winner_id == player2_id) {
                game_result--
            } else {
                continue
            }
        }

        if (game_result == 0) {
            await query(`UPDATE sessions SET session_status = 'COMPLETED' , winner_id = $1 , end_time = NOW() WHERE session_id = $2`, [null, session_id])
        } else if (game_result > 0) {
            await query(`UPDATE sessions SET session_status = 'COMPLETED' , winner_id = $1 , end_time = NOW() WHERE session_id = $2`, [player1_id, session_id])
        } else {
            await query(`UPDATE sessions SET session_status = 'COMPLETED' , winner_id = $1 , end_time = NOW() WHERE session_id = $2`, [player2_id, session_id])
        }
        return game_result
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

    getSession = async (session_id) => {
        const { rows } = await query(`SELECT * FROM sessions s 
                                    JOIN rounds r ON s.session_id = r.session_id  
                                    WHERE s.session_id = $1`, [session_id])

        return rows
    }

    getSessionsByUserID = async (user_id) => {
        const { rows } = await query(`SELECT * FROM sessions 
                                    WHERE player1_id = $1 OR player2_id = $2`
            , [user_id, user_id])
        return rows
    }

    getSessions = async () => {
        const { rows } = await query(`SELECT * FROM sessions`)
        return rows
    }

    deleteSession = async (session_id) => {
        const { rows } = await query(`DELETE FROM sessions WHERE session_id = $1`, [session_id])
        return rows
    }

}

export default new SessionDB()