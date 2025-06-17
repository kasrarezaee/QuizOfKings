import db from "../config/db.js"
import categoryDb from "./category.db.js"
import questionDb from "./question.db.js"

const { query, closeConnection } = db

class RoundDB {

    createRound = async (session_id, category_id, round_questions) => {

        let newRoundNumber = await this.getRoundNumber(session_id)

        const { rows: roundCreated } = await query(`INSERT INTO rounds(session_id , category_played , round_number) VALUES ($1 , $2 , $3) 
                                        RETURNING *`
            , [session_id, category_id, newRoundNumber])

        await query(`INSERT INTO round_questions(round_id , question_id) VALUES
                    ($1 , $2) , ($3 , $4) , ($5 , $6)`
            , [roundCreated[0].round_id
                , round_questions[0].question_id
                , roundCreated[0].round_id
                , round_questions[1].question_id
                , roundCreated[0].round_id
                , round_questions[2].question_id
            ]
        )
        const result = roundCreated
        return result;
    }

    questionCorrection = async (round_number, session_id) => {
        //for (let i = round_number; i > 0; i--) {
        const { rows: player_answers } = await query(`SELECT * FROM sessions s 
                JOIN rounds r ON r.session_id = s.session_id
                JOIN round_questions rq ON rq.round_id = r.round_id
                JOIN questions q ON q.question_id = rq.question_id `);

        const { rows: player1_answers } = await query(`SELECT * FROM sessions s 
                JOIN rounds r ON r.session_id = s.session_id
                JOIN round_questions rq ON rq.round_id = r.round_id
                JOIN questions q ON q.question_id = rq.question_id 
                WHERE rq.player1_answer = q.correct_answer`);

        const { rows: player2_answers } = await query(`SELECT * FROM sessions s 
                JOIN rounds r ON r.session_id = s.session_id
                JOIN round_questions rq ON rq.round_id = r.round_id
                JOIN questions q ON q.question_id = rq.question_id 
                WHERE rq.player2_answer = q.correct_answer`)


        const player1_id = player_answers[0].player1_id
        const player2_id = player_answers[0].player2_id
        const player1_correct_answers = player1_answers.length
        const player2_correct_answers = player2_answers.length

        if (this.isRoundComplete(player_answers)) {
            if (player1_correct_answers > player2_correct_answers) {
                await query(`UPDATE rounds SET winner_id = $1 , round_status = 'COMPLETED' 
                                WHERE session_id = $2 and round_number = $3`
                    , [player1_id, session_id, round_number])


            } else if (player1_correct_answers < player2_correct_answers) {
                await query(`UPDATE rounds SET winner_id = $1 , round_status = 'COMPLETED'
                                WHERE session_id = $2 and round_number = $3`
                    , [player2_id, session_id, round_number])

            }
            else {
                await query(`UPDATE rounds SET winner_id = $1 , round_status = 'COMPLETED'
                                WHERE session_id = $2 and round_number = $3`
                    , [null, session_id, round_number])
            }
        }
        //}
    }

    getTurn = async (session_id) => {
        const { rows } = await query(`SELECT * FROM sessions
            WHERE session_id = $1` , [session_id])

        let roundNumber = await this.getRoundNumber(session_id)

        if (roundNumber != 1) {
            this.questionCorrection(roundNumber - 1, session_id)
        }

        let turn = 0;
        if (roundNumber % 2 == 1) {
            turn = rows[0].player1_id
        } else {
            turn = rows[0].player2_id
        }

        return turn
    }

    getRoundNumber = async (session_id) => {
        const { rows: roundNumber } = await query(`SELECT MAX(round_number) FROM rounds r 
                                            JOIN sessions s on s.session_id = r.session_id 
                                            WHERE s.session_id = $1` , [session_id])


        let newRoundNumber = 0;
        if (roundNumber[0].max === null) {
            newRoundNumber = 1
        } else if (roundNumber[0].max != null) {
            //const { rows } = await query(`SELECT MAX(round_id) FROM rounds  
            //                                WHERE session_id = $1 ` , [session_id])


            //if (!this.isRoundComplete(rows[0].max, roundNumber[0].max)) {
            newRoundNumber = roundNumber[0].max + 1;
            //}
        }
        return newRoundNumber
    }
    isRoundComplete = async (player_answers) => {
        for (let i in player_answers) {
            if (i.player1_answer == null || i.player2_answer == null) {
                return false
            }
        }
        return true
    };

    submitAnswer = async ({ session_id, round_id, question_id, user_id, answer }) => {
        const { rows: users } = await query(`SELECT player1_id , player2_id 
                                        FROM sessions WHERE session_id = $1` , [session_id]);

        const { rows: question_answer } = await query(`SELECT correct_answer 
                                             FROM questions WHERE question_id = $1`
            , [question_id])
        let result = {}
        if (user_id == users[0].player1_id) {
            result = await query(`UPDATE round_questions SET player1_answer = $1 
                                WHERE round_id =$2 and question_id = $3 RETURNING *`
                , [answer, round_id, question_id])
        } else {
            result = await query(`UPDATE round_questions SET player2_answer = $1 
                                WHERE round_id =$2 and question_id = $3 RETURNING *`
                , [answer, round_id, question_id])
        }
        return question_answer;
    }

    getRound = async (round_id) => {
        const { rows } = await query(`SELECT * FROM rounds r 
                                    JOIN round_questions rq ON r.round_id = rq.round_id
                                    JOIN questions q ON q.quesiton_id = rq.question_id 
                                    WHERE r.round_id = $1` , [round_id])
        return rows
    }

    deleteRound = async (round_id) => {
        const { rows } = await query(`DELETE FROM rounds WHERE round_id = $1 RETURNING *`, [round_id])
        return rows
    }

}

export default new RoundDB()