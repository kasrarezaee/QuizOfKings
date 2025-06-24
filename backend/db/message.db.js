import db from "../config/db.js";
const { query, closeConnection } = db;

class MessageDB {
    createMessage = async (sender_id, receiver_id, message_body) => {
        const { rows } = await query(`INSERT INTO messages(sender_id , receiver_id , message_body)
                                    VALUES ($1 , $2 , $3)` , [sender_id, receiver_id, message_body])

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

    getMessages = async (sender_id, receiver_id) => {
        const { rows } = await query(`SELECT * FROM messages 
            WHERE ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $3 AND receiver_id = $4)) AND is_deleted = false
            ORDER BY time_stamp ASC`
            , [sender_id, receiver_id, receiver_id, sender_id])

        return rows
    }
}

export default new MessageDB()