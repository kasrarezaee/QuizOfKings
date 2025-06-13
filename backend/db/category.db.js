import db from "../config/db.js";
const { query, closeConnection } = db;

class CategoryDB {
  createCategory = async ({ category_name }) => {
    const { rows } = await query(
      `INSERT INTO categories(name) VALUES ($1) RETURNING *`,
      [category_name]
    );
    return rows;
  };

  getAllCategories = async () => {
    const { rows } = await query(`SELECT * FROM categories`);
    return rows;
  };

  deleteAllCategories = async () => {
    const { rows } = await query(
      `DELETE FROM categories WHERE category_id IS NOT NULL RETURNING *`
    );
    return rows;
  };

  getCategory = async (category_id) => {
    const { rows } = await query(
      `SELECT * FROM categories WHERE category_id = $1`,
      [category_id]
    );
    return rows;
  };

  deleteCategory = async (category_id) => {
    const { rows } = await query(
      `DELETE FROM categories WHERE category_id = $1`,
      [category_id]
    );
    return rows;
  };

  getRandomCategories = async () => {
    const { rows } = await query(`SELECT * FROM categories ORDER BY RANDOM() LIMIT 3`)
    return rows;
  }
}

export default new CategoryDB();
