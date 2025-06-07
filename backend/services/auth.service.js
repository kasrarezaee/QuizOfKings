import crypto from "crypto"
import jwt from "jsonwebtoken"
import userDb from "../db/user.db.js"
import moment, { min } from "moment"
import validateUser from "../utils/validateUser.js"
import hashPassword from "../utils/hashPassword.js"

const currentDate = moment().format()
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

                if (userByUserName) {
                    throw new Error("username taken already")
                }
                if (userByEmail) {
                    throw new Error("email taken already")
                }

                const newUser = await userDb.createUser({
                    ...user,
                    password: hashedPassword
                })

                const userRoles = await userDb.getUserRoles(newUser.user_id)

                const token = await this.signToken({
                    id: newUser.user_id,
                    roles: userRoles,
                })

                const refreshToken = await this.signRefreshToken({
                    id: newUser.user_id,
                    roles: userRoles,
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
                const userByEmail = await userDb.getUserByEmail(email)
                if (!user) {
                    throw new Error("email is incorrect")
                }

                const { passwrod_hash, user_id, username, email } = user
                const isPasswordCorrect = hashPassword.comparePassword(password, passwrod_hash)

                if (!isPasswordCorrect) {
                    throw new Error("password is incorrect")
                }

                const userRoles = await userDb.getUserRoles(user_id)

                const token = await this.signToken({
                    id: user_id,
                    roles: userRoles,
                })

                const refreshToken = await this.signRefreshToken({
                    id: user_id,
                    roles: userRoles,
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

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "60s" })
        const refreshToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "15m" })

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
            return jwt.sign(data, process.env.SECRET, { expiresIn: "60s" })
        } catch (err) {
            throw new Error("an error occured")
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