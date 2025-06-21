import db from "../config/db.js";
const { query, closeConnection } = db;

class ModerationDB {
    createModeration = async ({ moderator_id, target_user_id, target_question_id, action_type, notes }) => {
        const { rows } = await query(`INSERT INTO moderation_actions
                                    (moderator_id , target_user_id , target_question_id , action_type , notes)
                                    VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *`
            , [moderator_id, target_user_id, target_question_id, action_type, notes])

        return rows
    }

    getModerations = async () => {
        const { rows } = await query(`SELECT * FROM moderation_actions`)
        return rows
    }
}

export default new ModerationDB();
