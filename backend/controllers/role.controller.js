import roleService from "../services/role.service.js";

class RoleController {
  getAllRoles = async (req, res) => {
    const result = await roleService.getAllRoles();
    res.status(200).json(result);
  };

  deleteAllRoles = async (req, res) => {
    const result = await roleService.deleteAllRoles();
    res.status(200).json({
      status: "success",
    });
  };

  createRole = async (req, res) => {
    const role = req.body;
    const roleCreated = await roleService.createRole(role);
    res.status(200).json(roleCreated);
  };

  getRole = async (req, res) => {
    const { id } = req.params;
    const result = await roleService.getRole(id);
    res.status(200).json(result);
  };

  deleteRole = async (req, res) => {
    const { id } = req.params;
    const result = await roleService.deleteRole(id);
    res.status(200).json({
      status: "success",
      result,
    });
  };
}

export default new RoleController();
