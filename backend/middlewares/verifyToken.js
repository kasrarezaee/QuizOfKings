import jwt from "jsonwebtoken"

const verifyToken = async (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        throw new Error("token is missing")
    }
    try {
        const verifiedUser = jwt.verify(token, process.env.SECRET)
        req.user = verifiedUser
        next()
    } catch (err) {
        throw new Error("invalid token" + err)
    }
}

export default verifyToken;