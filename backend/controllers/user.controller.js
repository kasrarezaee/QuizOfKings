import userService from "../services/user.service.js"


class UserController{
    
    createUser = async (req , res)=>{
        const user = req.body;
        const userCreated = await userService.createUser(user);
        res.status(200).json({
            status : "success",
            userCreated
        })
    }

    getAllUsers = async (req , res)=>{
        const result = await userService.getAllUsers()
        res.status(200).json(result)
    }
    
    getUserByID = async (req , res)=>{
        const {id} = req.params;
        //implementing authorization and authentication
        try{
            const user = await userService.getUserByID(id)
            res.status(200).json(user)
        }catch(err){
            res.status(404)
        }
    }

    getUserByUserName = async (req , res) =>{
        const {username} = req.params;
        try{
            const user = await userService.getUserByUserName(username)
            res.status(200).json(user)
        }catch(err){
            res.status(404)
        }
    }

    getUserByEmail = async (req , res)=>{
        const {email} = req.params;
        try{
            const user = await userService.getUserByEmail(email)
            res.status(200).json(user)
        }catch(err){
            res.status(404)
        }
    }

    deleteUserByID = async (req, res)=>{
        const {id} = req.params; 
        //implementing authorization and authentication
        try{
            const user = await userService.deleteUserByID(id)
            res.status(200).json(user)
        }catch(err){
            res.status(404)
        }
    }    
    
    checkUserExists = async (req , res) =>{
        const {email , username} = req.params;
        try{
            const userExists = await userService.checkUserExists(email , username)
            res.status(200).json({
                userExists:userExists
            })
        }catch(err){
            res.status(404)
        }    
    }

    blockUser = async (req , res)=>{
        const {id} = req.params;
        
        try{
            const user = await userService.blockUser(id)
            res.status(200).json({
                status:"success",
                user
            })
        }catch(err){
            res.status(404)
        }
    }

    unblockUser = async (req , res)=>{
        const {id} = req.params;
        try{
            const user = await userService.unblockUser(id)
            res.status(200).json({
                status:"success",
                user
            })
        }catch(err){
            res.status(404)
        }
    }

    assignRole = async (req , res) =>{
        const {user_id , role_id} = req.params;
        try{
            const user_role = await userService.assignRole(user_id , role_id)
            res.status(200).json({
                status:"success",
                user_role
            })
        }catch(err){
            res.status(404)
        }
    }

    deleteRole = async (req , res) =>{
        const {user_id , role_id} = req.params;
        try{
            const user_role = await userService.deleteRole(user_id , role_id)
            res.status(200).json({
                status:"success",
                user_role
            })
        }catch(err){
            res.status(404)
        }
    }

    getUserRoles = async (req , res) =>{
        const {user_id} = req.params;
        try{
            const roles = await userService.getUserRoles(user_id)
            res.status(200).json(roles)
        }catch(err){
            res.status(404)
        }
    }

    updateUser = async (req , res)=> {
        const {id} = req.params;
        const {username , email , password} = req.body;
        
        try{
            const user = await userService.updateUser(id , {username , email , password})
            res.status(200).json({
                status:"success",
                user
            })
        }catch(err){
            res.status(404)
        }
    }    
}

export default new UserController();