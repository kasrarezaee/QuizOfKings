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

    getUserByID = async (user_id)=>{
        const {rows} = await query('SELECT * FROM users WHERE user_id = $1' , [user_id])
        return rows;
    }

    getUserByUserName = async (username) =>{
        const{rows} = await query(`SELECT * FROM users WHERE username = $1` , [username])
        return rows
    }

    deleteUserByID = async (user_id)=>{
        
        const {rows} = await query(`DELETE FROM users WHERE user_id=$1 RETURNING *` , [user_id])
        return rows
    }
}

export default new UserDB();

