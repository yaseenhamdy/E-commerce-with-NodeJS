import Product from "./product.model.js";
import catchError from "../../Middleware/catchError.js";


const createProduct = catchError(async (req, res) => {

    const product = new Product({ ...req.body, seller: req.user._id });
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
});


const getProducts = catchError(async (req, res) => {
    const { category, minPrice, maxPrice, search } = req.query;
    let filter = {};


    if (category) filter.category = category;


    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }


    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("category", "name").populate("seller", "name");
    res.status(200).json({ products });
});


const getProductById = catchError(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category", "name").populate("seller", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
});


const updateProduct = catchError(async (req, res) => {
    const { id } = req.params;


    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully", updatedProduct });
});


const deleteProduct = catchError(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
});

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};


