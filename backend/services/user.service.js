import userDb from "../db/user.db.js";
import HashPassword from "../utils/hashPassword.js";
import validateEmail from "../utils/emailValidator.js"

class UserService {
    getAllUsers = async ()=>{
        try{
            return await userDb.getAllUsers();
        }catch(err){
            throw new Error("something went wrong")
        }
    }
    
    createUser = async ({username , email , password})=>{
        try{
            if (validateEmail(email)){
                const password_hash = await HashPassword.hashPassword(password)  
                return await userDb.createUser(username , email , password_hash)
            }
            return "invalid email"
        }catch(err){
            throw new Error(err)
        }     
    }

    getUserByID = async (user_id)=>{
        try{
            return await userDb.getUserByID(user_id);
        }catch(err){
            throw new Error("something went wrong")
        }
    }

    getUserByUserName = async (username) =>{
        try{
            return await userDb.getUserByUserName(username);
        }catch(err){
            throw new Error("something went wrong")
        }
    }

    deleteUserByID = async (user_id)=>{
        try{
            return await userDb.deleteUserByID(user_id);
        }catch(err){
            throw new Error("something went wrong")
        }
    }


}

export default new UserService()