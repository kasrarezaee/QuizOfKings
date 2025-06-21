import moderationService from "../services/moderation.service.js";

class ModerationController {
    createModeration = async (req, res) => {
        const moderation = req.body;
        const result = await moderationService.createModeration(moderation);
        res.status(200).json(result);
    };

    getModerations = async (req, res) => {
        const result = await moderationService.getModerations();
        res.status(200).json(result);
    }
}

export default new ModerationController();
