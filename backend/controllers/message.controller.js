import messageService from "../services/message.service.js";

class MessageController {
    createMessage = async (req, res) => {
        const { sender_id, receiver_id } = req.params
        const { message_body } = req.body
        const result = await messageService.createMessage(sender_id, receiver_id, message_body)
        res.status(200).json(result)
    }

    deleteMessage = async (req, res) => {
        const { message_id } = req.params
        const result = await messageService.updateMessage(message_id)
        res.status(200).json(result)
    }

    updateMessage = async (req, res) => {
        const { message_id } = req.params
        const { message_body } = req.body
        const result = await messageService.updateMessage(message_id, message_body)
        res.status(200).json(result)
    }

    getMessages = async (req, res) => {
        const { sender_id, receiver_id } = req.params
        const result = await messageService.getMessages(sender_id, receiver_id)
        res.status(200).json(result)
    }
}

export default new MessageController()