import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import catchError from "../../Middleware/catchError.js";


const createProduct = catchError(async (req, res) => {
    const { name } = req.body;
    const sellerId = req.user._id;


    const exists = await Product.findOne({ name, seller: sellerId });
    if (exists) {
        return res.status(400).json({ message: "You already created a product with this name" });
    }


    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
        return res.status(404).json({ message: "The selected category does not exist" });
    }

    const product = new Product({ ...req.body, seller: sellerId });
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
});


const getProducts = catchError(async (req, res) => {
    const { category, minPrice, maxPrice, search } = req.query;



    let filter = { isActive: true, isApproved: true };

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

    const product = await Product.findOne({ _id: id, isActive: true, isApproved: true })
        .populate("category", "name")
        .populate("seller", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
});


const updateProduct = catchError(async (req, res) => {
    const { id } = req.params;


    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to update this product" });
    }


    if (req.user.role === "seller") {
        req.body.isApproved = false;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully (Pending review if edited by seller)", updatedProduct });
});


const deleteProduct = catchError(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });


    if (!product.isActive) return res.status(400).json({ message: "Product is already deleted" });

    if (product.seller.toString() !== req.user._id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to delete this product" });
    }


    product.isActive = false;
    await product.save();

    res.status(200).json({ message: "Product deleted (Soft Delete) successfully" });
});

const getPendingProducts = catchError(async (req, res) => {

    const products = await Product.find({ isActive: true, isApproved: false })
        .populate("category", "name")
        .populate("seller", "name");

    res.status(200).json({ message: "Pending products", products });
});

const approveProduct = catchError(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.isApproved) {
        return res.status(400).json({ message: "Product is already approved" });
    }

    product.isApproved = true;
    await product.save();

    res.status(200).json({ message: "Product approved successfully", product });
});

const getMyProducts = catchError(async (req, res) => {
    const sellerId = req.user._id;


    const products = await Product.find({ seller: sellerId })
        .populate("category", "name");

    res.status(200).json({ message: "Your products retrieved successfully", products });
});

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getPendingProducts,
    approveProduct,
    getMyProducts
};


