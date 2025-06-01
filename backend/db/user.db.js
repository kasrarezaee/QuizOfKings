import db from "../config/db.js"
const {query , closeConnection} = db;
class UserDB{
    getAllUsers = async ()=>{
        const {rows} = await query("SELECT * FROM users");
        return rows;
    }
    
    createUser = async (username , email , password_hash )=>{
        const {rows} = await query(`INSERT INTO users(username , email , password_hash) 
                    VALUES ($1 , $2 , $3)
                    RETURNING 
                    user_id , username , email , password_hash 
                    , registration_date , is_blocked , xp_level` , [username , email , password_hash])
        return rows;    
    }
}

export default new UserDB();

