import roundDB from "../db/round.db.js"

class RoundService {
    createRound = async (session_id, category_id, round_questions) => {
        try {
            return await roundDB.createRound(session_id, category_id, round_questions)
        } catch (err) {
            throw new Error(err)
        }
    }

    getTurn = async (session_id) => {
        try {
            return await roundDB.getTurn(session_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    submitAnswer = async ({ session_id, round_id, question_id, user_id, answer }) => {
        try {
            return await roundDB.submitAnswer({ session_id, round_id, question_id, user_id, answer })
        } catch (err) {
            throw new Error(err)
        }
    }

    getRound = async (round_id) => {

        try {
            return await roundDB.getRound(round_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    deleteRound = async (round_id) => {
        try {
            return await roundDB.deleteRound(round_id)
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default new RoundService()