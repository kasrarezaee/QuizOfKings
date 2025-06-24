import messageDb from "../db/message.db.js"

class MessageService {
    createMessage = async (sender_id, receiver_id, message_body) => {
        try {
            return await messageDb.createMessage(sender_id, receiver_id, message_body)
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

    getMessages = async (sender_id, receiver_id) => {
        try {
            return await messageDb.getMessages(sender_id, receiver_id)
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default new MessageService()