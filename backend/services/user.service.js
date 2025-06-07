import userDb from "../db/user.db.js";
import HashPassword from "../utils/hashPassword.js";
import validateUser from "../utils/validateUser.js"

class UserService {
    getAllUsers = async () => {
        try {
            return await userDb.getAllUsers();
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    createUser = async ({ username, email, password }) => {
        try {
            //if (validateEmail(email)){
            //const password_hash = await HashPassword.hashPassword(password)
            return await userDb.createUser(username, email, password)
            // }
            return "invalid email"
        } catch (err) {
            throw new Error(err)
        }
    }

    getUserByID = async (user_id) => {
        try {
            return await userDb.getUserByID(user_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    getUserByUserName = async (username) => {
        try {
            return await userDb.getUserByUserName(username);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    getUserByEmail = async (email) => {
        try {
            return await userDb.getUserByEmail(email);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    deleteUserByID = async (user_id) => {
        try {
            return await userDb.deleteUserByID(user_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    checkUserExists = async (email, username) => {
        try {
            return await userDb.checkUserExists(email, username);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    blockUser = async (user_id) => {
        try {
            return await userDb.blockUser(user_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    unblockUser = async (user_id) => {
        try {
            return await userDb.unblockUser(user_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    assignRole = async (user_id, role_id) => {
        try {
            return await userDb.assignRole(user_id, role_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    deleteRole = async (user_id, role_id) => {
        try {
            return await userDb.deleteRole(user_id, role_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    getUserRoles = async (user_id) => {
        try {
            return await userDb.getUserRoles(user_id);
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

    updateUser = async (user_id, { username, email, password }) => {
        try {
            //return await userDb.updateUser(user_id , {username , email , password_hash});
            if (validateEmail(email)) {
                const password_hash = await HashPassword.hashPassword(password)
                return await userDb.updateUser(user_id, { username, email, password_hash })
            }
            return "invalid email"
        } catch (err) {
            throw new Error("something went wrong")
        }
    }

}

export default new UserService()