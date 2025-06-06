import categoryDb from "../db/category.db.js";

class CategoryService {
  createCategory = async (category_name) => {
    try {
      return await categoryDb.createCategory(category_name);
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  getAllCategories = async () => {
    try {
      return await categoryDb.getAllCategories();
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  deleteAllCategories = async () => {
    try {
      return await categoryDb.deleteAllCategories();
    } catch (err) {
      console.log(err);
      throw new Error("something went wrong");
    }
  };

  getCategory = async (category_id) => {
    try {
      return await categoryDb.getCategory(category_id);
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  deleteCategory = async (category_id) => {
    try {
      return await categoryDb.deleteCategory(category_id);
    } catch (err) {
      throw new Error("something went wrong");
    }
  };

  getRandomCategories = async () => {
    try {
      return await categoryDb.getRandomCategories()
    } catch (err) {
      throw new Error(err)
    }
  }

}

export default new CategoryService();
