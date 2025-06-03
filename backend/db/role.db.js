import db from "../config/db.js";

const { query, colseConnection } = db;

class RoleDB {
  getAllRoles = async () => {
    const { rows } = await query(`SELECT * FROM roles`);
    return rows;
  };

  deleteAllRoles = async () => {
    const { rows } = await query(`DELETE FROM roles 
                                WHERE role_id IS NOT NULL 
                                RETURNING *`);
    return rows;
  };

  createRole = async (role_name) => {
    const { rows } = await query(
      `INSERT INTO roles (role_name) 
                                VALUES ($1) 
                                RETURNING *`,
      [role_name]
    );
    return rows;
  };

  getRole = async (role_id) => {
    const { rows } = await query(`SELECT * FROM roles WHERE role_id = $1`, [
      role_id,
    ]);
    return rows;
  };

  deleteRole = async (role_id) => {
    const { rows } = await query(`DELETE FROM roles WHERE role_id = $1`, [
      role_id,
    ]);
  };
}

export default new RoleDB();
