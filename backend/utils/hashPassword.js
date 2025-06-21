import bcrypt from "bcryptjs"

class HashPassword {
    hashPassword = async (password) => {
        //const salt = await bcrypt.genSalt()
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    }

    comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword.trim())
    }
}

export default new HashPassword();