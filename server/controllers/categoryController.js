import Category from "../models/Category.js";
import Article from "../models/Article.js";

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, data: categories });
};

export const createCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json({ success: true, data: category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });
  category.name = req.body.name;
  await category.save();
  res.json({ success: true, data: category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });
  const inUse = await Article.exists({ category: category.name });
  if (inUse) return res.status(400).json({ success: false, message: "A category with articles cannot be deleted" });
  await category.deleteOne();
  res.json({ success: true, message: "Category deleted" });
};
