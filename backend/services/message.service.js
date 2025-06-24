import messageDb from "../db/message.db.js"

class MessageService {
    createMessage = async (session_id, sender_id, receiver_id, message_body) => {
        try {
            console.log("service ")
            console.log(session_id)
            return await messageDb.createMessage(session_id, sender_id, receiver_id, message_body)
        } catch (err) {
            throw new Error(err)
        }
    }

    deleteMessage = async (message_id) => {
        try {
            return await messageDb.deleteMessage(message_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    updateMessage = async (message_id, message_body) => {
        try {
            return await messageDb.updateMessage(message_id, message_body)
        } catch (err) {
            throw new Error(err)
        }
    }

    getMessages = async (session_id) => {
        try {
            return await messageDb.getMessages(session_id)
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default new MessageService()