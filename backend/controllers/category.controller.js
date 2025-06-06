import categoryService from "../services/category.service.js";

class CategoryController {
  createCategory = async (req, res) => {
    const category_name = req.body;
    const result = await categoryService.createCategory(category_name);
    res.status(200).json(result);
  };

  getAllCategories = async (req, res) => {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  };

  deleteAllCategories = async (req, res) => {
    const result = await categoryService.deleteAllCategories();
    res.status(200).json(result);
  };

  getCategory = async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.getCategory(id);
    res.status(200).json(result);
  };

  deleteCategory = async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json(result);
  };

  getRandomCategories = async (req, res) => {
    result = await categoryService.getRandomCategories()
    res.status(200).json(result)
  }
}

export default new CategoryController();
