import sessionDB from "../db/session.db.js"

class SessionService {
    createSession = async (player1_id) => {
        try {
            return await sessionDB.createSession(player1_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    getSession = async (session_id) => {
        try {
            return await sessionDB.getSession(session_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    getSessionsByUserID = async (user_id) => {
        try {
            return await sessionDB.getSessionsByUserID(user_id)
        } catch (err) {
            throw new Error(err)
        }
    }

    getSessions = async () => {
        try {
            return await sessionDB.getSessions()
        } catch (err) {
            throw new Error(err)
        }
    }

    deleteSession = async (session_id) => {
        try {
            return await sessionDB.deleteSession(session_id)
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default new SessionService()