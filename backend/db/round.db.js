import db from "../config/db.js"
import categoryDb from "./category.db.js"
import questionDb from "./question.db"

const { query, closeConnection } = db

class RoundDB {

    createRound = async (session_id, category_id, round_questions) => {
        let newRoundNumber = this.getRoundNumber(session_id)

        const { roundCreated } = await query(`INSERT INTO rounds(session_id , category_played , round_number) VALUES ($1 , $2 , $3) 
                                        RETURNING *`
            , [session_id, category_id, newRoundNumber])

        await query(`INSERT INTO round_questions(round_id , question_id) VALUES
                    ($1 , $2) , ($3 , $4) , ($5 , $6)`
            , [roundCreated.round_id
                , round_questions[0].question_id
                , roundCreated.round_id
                , round_questions[1].question_id
                , roundCreated.round_id
                , round_questions[2].question_id
            ]
        )
        const result = roundCreated
        return { result, turn };
    }

    getTurn = async (session_id) => {
        const { player1_id, player2_id } = await query(`SELECT player1_id , player2_id FROM sessions
            WHERE session_id = $1` , [session_id])
        let roundNumber = this.getRoundNumber(session_id)
        let turn = 0;
        if (roundNumber % 2 == 1) {
            turn = player1_id
        } else {
            turn = player2_id
        }
        return turn
    }

    getRoundNumber = async (session_id) => {
        const { roundNumber } = await query(`SELECT MAX(round_number) FROM rounds r 
                                            JOIN session s on s.session_id = r.session_id 
                                            WHERE session_id = $1` , [session_id])


        let newRoundNumber = 0;
        if (roundNumber == null) {
            newRoundNumber = 1
        } else if (roundNumber != null) {
            const { round_id } = await query(`SELECT round_id FROM rounds r 
                                            JOIN session s on s.session_id = r.session_id 
                                            WHERE session_id = $1 ` , [session_id])

            if (!this.isRoundComplete(round_id, roundNumber)) {
                newRoundNumber = roundNumber + 1;
            }
        }
        return newRoundNumber
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
            return true;
        }

        return false;
    };

    submitAnswer = async ({ session_id, round_id, question_id, user_id, answer }) => {
        const { users } = await query(`SELECT player1_id , player2_id 
                                        FROM sessions WHERE session_id = $1` , [session_id]);

        let result = {}
        if (user_id == users.player1_id) {
            result = await query(`UPDATE round_questions SET player1_answer = $1 
                                WHERE round_id =$2 and question_id = $3 RETURNING *`
                , [answer, round_id, question_id])
        } else {
            result = await query(`UPDATE round_questions SET player1_answer = $1 
                                WHERE round_id =$2 and question_id = $3 RETURNING *`
                , [answer, round_id, question_id])
        }
        return result;
    }

}