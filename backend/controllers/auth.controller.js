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
            userRoles
        })

    }

    refresh_token = async (req, res) => {
        let refresh = {}
        if (!req.cookies.refreshToken) {
            //throw new Error("token is missing")
            if (req.body.refreshToken) {
                refresh = req.body.refreshToken
                console.log("body: " + refresh)
            } else {
                throw new Error("token is missing")
            }
        } else {
            refresh = req.cookies.refreshToken
            console.log("cookie: " + refresh)
        }
        //yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsInJvbGVzIjpbXSwiaWF0IjoxNzUwMzYxMjE4LCJleHAiOjE3NTAzNjIxMTh9.zf79p8srMF-ZydzBaQnMtBZVnFLmdvlf53PgH1FfF7c
        //yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsInJvbGVzIjpbXSwiaWF0IjoxNzUwMzYxMzIzLCJleHAiOjE3NTAzNjIyMjN9.0DikOKP-hqVkhyHWeSAuMGXDpvq-eRUt_hFMl2e4NHU
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsInJvbGVzIjpbXSwiaWF0IjoxNzUwMzYwNDc5LCJleHAiOjE3NTAzNjEzNzl9.quemn5hBhlzUhwRzpoKqr0AM_0ALNvrRqCH5ku1eNEs
        const { token, refreshToken } = await authService.generateRefreshToken(refresh)
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