import moderationDb from "../db/moderation.db.js";

class ModerationService {
    createModeration = async (moderation) => {
        try {
            return await moderationDb.createModeration(moderation);
        } catch (err) {
            throw new Error(err);
        }
    }

    getModerations = async () => {
        try {
            return await moderationDb.getModerations();
        } catch (err) {
            throw new Error("something went wrong");
        }
    }
}

export default new ModerationService();
