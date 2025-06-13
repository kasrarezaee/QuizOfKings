import sessionService from "../services/session.service.js";

class SessionController {

    createSession = async (req, res) => {
        const { id } = req.params
        const result = await sessionService.createSession(id)
        res.status(200).json(result)
    }

    getSession = async (req, res) => {
        const { id } = req.params
        const result = await sessionService.getSession(id)
        res.status(200).json(result)
    }

    getSessionsByUserID = async (req, res) => {
        const { id } = req.params
        const result = await sessionService.getSessionsByUserID(id)
        res.status(200).json(result)
    }

    getSessions = async (req, res) => {
        const result = await sessionService.getSessions()
        res.status(200).json(result)
    }

    deleteSession = async (req, res) => {
        const { id } = req.params
        const result = await sessionService.deleteSession(id)
        res.status(200).json(result)
    }
}

export default new SessionController()