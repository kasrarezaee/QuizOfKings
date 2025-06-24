import db from "../config/db.js";
const { query, closeConnection } = db;

class MessageDB {
    createMessage = async (session_id, sender_id, receiver_id, message_body) => {
        const { rows } = await query(`INSERT INTO messages(sender_id , receiver_id , message_body)
                                    VALUES ($1 , $2 , $3) RETURNING * ` , [sender_id, receiver_id, message_body])


        await query(`INSERT INTO session_messages (session_id , message_id) VALUES($1 , $2)`
            , [session_id, rows[0].message_id])
        return rows
    }

    deleteMessage = async (message_id) => {

        const { rows } = await query(`UPDATE messages 
            SET time_stamp = NOW() , is_deleted = true WHERE message_id = $1
            RETURNING *` , [message_id])
        return rows
    }

    updateMessage = async (message_id, message_body) => {

        const { rows } = await query(`UPDATE messages 
            SET message_body = $1 , is_edited = true WHERE message_id = $2
            RETURNING *` , [message_body, message_id])

        return rows
    }

    getMessages = async (session_id) => {

        const { rows } = await query(`SELECT * FROM session_messages sm 
                                    JOIN messages m ON m.message_id = sm.message_id
                                    WHERE sm.session_id = $1 AND m.is_deleted = false ORDER BY m.time_stamp ASC` , [session_id])
        return rows
    }


}

export default new MessageDB()