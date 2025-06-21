import roundService from "../services/round.service.js";

class RoundController {
    createRound = async (req, res) => {
        const { session_id, category_id, round_questions } = req.body
        const result = await roundService.createRound(session_id, category_id, round_questions)
        res.status(200).json(result)
    }

    getTurn = async (req, res) => {
        const { session_id } = req.params
        const result = await roundService.getTurn(session_id)
        res.status(200).json(result)
    }

    submitAnswer = async (req, res) => {
        const result = await roundService.submitAnswer(req.body)
        res.status(200).json(result)
    }

    getRound = async (req, res) => {
        const { round_id } = req.params
        const result = await roundService.getRound(round_id)
        res.status(200).json(result)
    }

    deleteRound = async (req, res) => {
        const { id } = req.params
        const result = await roundService.deleteRound(id)
        res.status(200).json(result)
    }
}

export default new RoundController()