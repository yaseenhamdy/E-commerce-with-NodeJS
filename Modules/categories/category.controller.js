import Category from "./category.model.js";
import catchError from "../../Middleware/catchError.js";


const createCategory = catchError(async (req, res) => {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
});


const getAllCategories = catchError(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({ categories });
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
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
});

export {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
