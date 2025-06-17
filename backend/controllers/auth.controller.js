import { ref } from "process";
import authService from "../services/auth.service.js";

class AuthController {
    signUp = async (req, res) => {
        const { token, refreshToken, newUser } = await authService.signUp(req.body)
        res.header("auth-token", token)
        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        })
        res.status(200).json({
            token,
            newUser
        })

    }

    login = async (req, res) => {
        const { email, password } = req.body
        const { userRoles, token, refreshToken, user } = await authService.login(email, password)
        res.header("auth-token", token)
        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict"
        })

        res.status(200).json({
            token,
            user,
        })

    }

    refresh_token = async (req, res) => {
        if (!req.cookies.refreshToken) {
            throw new Error("token is missing")
        }

        const { token, refreshToken } = await authService.generateRefreshToken(req.cookies.refreshToken)
        res.header("auth-token", token)
        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict"
        })

        res.status(200).json({
            token
        })

    }
}


export default new AuthController()