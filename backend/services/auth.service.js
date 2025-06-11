import crypto from "crypto"
import jwt from "jsonwebtoken"
import userDb from "../db/user.db.js"
import validateUser from "../utils/validateUser.js"
import hashPassword from "../utils/hashPassword.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()

class AuthService {
    signUp = async (user) => {
        try {
            const { username, password, email } = user;
            if (!username || !email || !password) {
                throw new Error("all field required")
            }
            if (validateUser(email, password)) {
                const hashedPassword = await hashPassword.hashPassword(password)
                const userByEmail = await userDb.getUserByEmail(email)
                const userByUserName = await userDb.getUserByUserName(username)
                if (userByUserName.length > 0) {
                    throw new Error("username taken already")
                }
                if (userByEmail.length > 0) {
                    throw new Error("email taken already")
                }

                const newUser = await userDb.createUser(user.username, user.email, hashedPassword)
                const userRoles = await userDb.getUserRoles(newUser[0].user_id)
                console.log(newUser[0].user_id)
                const token = await this.signToken({
                    id: newUser[0].user_id,
                    roles: userRoles
                })

                const refreshToken = await this.signRefreshToken({
                    id: newUser[0].user_id,
                    roles: userRoles
                })
                return {
                    token,
                    refreshToken,
                    newUser
                }

            } else {
                throw new Error("input validation error")
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    login = async (email, password) => {
        try {
            if (validateUser(email, password)) {
                const user = await userDb.getUserByEmail(email)//error occur here

                if (user.length == 0) {
                    throw new Error("email is incorrect")
                }

                const { password_hash, user_id, username, email: user_email } = user[0]
                const isPasswordCorrect = await hashPassword.comparePassword(password, password_hash)
                if (!isPasswordCorrect) {
                    throw new Error("password is incorrect")
                }

                const userRoles = await userDb.getUserRoles(user_id)

                const token = await this.signToken({
                    id: user_id,
                    roles: userRoles
                })

                const refreshToken = await this.signRefreshToken({
                    id: user_id,
                    roles: userRoles
                })

                return {
                    token,
                    refreshToken,
                    user
                }

            } else {
                throw new Error("input validation error")
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    generateRefreshToken = async (data) => {
        const payload = await this.verifyRefreshToken(data)
        console.log(payload.id)
        //const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "60s" })
        //const refreshToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "15m" })
        const token = await this.signToken({ id: payload.id, roles: payload.roles })
        const refreshToken = await this.signRefreshToken({ id: payload.id, roles: payload.roles })
        console.log(token + "  service  " + refreshToken)
        return {
            token,
            refreshToken
        }
    }
    verifyRefreshToken = async (data) => {
        try {
            const payload = jwt.verify(data, process.env.SECRET)
            return payload

        } catch (err) {
            throw new Error(err)
        }
    }


    signToken = async (data) => {
        try {
            return jwt.sign(data, process.env.SECRET, { expiresIn: "600s" })
        } catch (err) {
            console.log(process.env.SECRET)
            throw new Error(err + "an error occured")
        }
    }

    signRefreshToken = async (data) => {
        try {
            return jwt.sign(data, process.env.SECRET, { expiresIn: "15m" })
        } catch (err) {
            throw new Error("an error occured")
        }
    }
}

export default new AuthService()