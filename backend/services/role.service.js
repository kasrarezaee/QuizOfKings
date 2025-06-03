import roleDb from "../db/role.db.js";

class RoleService {
  getAllRoles = async () => {
    try {
      return await roleDb.getAllRoles();
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  deleteAllRoles = async () => {
    try {
      return await roleDb.deleteAllRoles();
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  createRole = async ({ role_name }) => {
    try {
      return await roleDb.createRole(role_name);
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  getRole = async (role_id) => {
    try {
      return await roleDb.getRole(role_id);
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  deleteRole = async (role_id) => {
    try {
      return await roleDb.deleteRole(role_id);
    } catch (err) {
      console.log(err);
      throw new Error("something went wrong");
    }
  };
}

export default new RoleService();
