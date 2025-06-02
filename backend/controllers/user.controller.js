import userService from "../services/user.service.js"


class UserController{
    getAllUsers = async (req , res)=>{
        const result = await userService.getAllUsers()
        res.status(200).json(result)
    }
    
    createUser = async (req , res)=>{
        const user = req.body;
        const userCreated = await userService.createUser(user);
        res.status(200).json({
            status : "success",
            userCreated
        })
    }

    getUserByID = async (req , res)=>{
        console.log("hrer")
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
    
}

export default new UserController();