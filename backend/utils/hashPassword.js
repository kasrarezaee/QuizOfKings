import bcrypt from "bcryptjs"

class HashPassword{
    hashPassword = async (password) =>{
        const salt = await bcrypt.genSalt()
        const hashedPassword = bcrypt.hash(password , salt)
        return hashedPassword;
    }
    
    comparePassword = async (password , hashedPassword)=>{
        return await bcrypt.compare(password , hashedPassword)
    }
}

export default new HashPassword();