import Category from "./category.model.js";
import Product from "../products/product.model.js";
import catchError from "../../Middleware/catchError.js";


const createCategory = catchError(async (req, res) => {
    const { name } = req.body;


    const exists = await Category.findOne({ name });
    if (exists) {
        return res.status(400).json({ message: "Category name already exists" });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
});


const getAllCategories = catchError(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({ categories });
});


const getCategoryById = catchError(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category });
});


const updateCategory = catchError(async (req, res) => {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
        id,
        { name, isActive },
        { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated successfully", category });
});


const deleteCategory = catchError(async (req, res) => {
    const { id } = req.params;


    const categoryExists = await Category.findById(id);
    if (!categoryExists) return res.status(404).json({ message: "Category not found" });


    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
        return res.status(400).json({
            message: "Cannot delete this category because it contains products. Please delete or move the products first."
        });
    }


    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
