import mongoose from "mongoose";
import catchError from "../../Middleware/catchError.js";
import { ROLES } from "../../Constants/roles.js";
import Product from "../products/product.model.js";
import reviewModel from "./review.model.js";

const recalculateProductRating = async (productId) => {
    const reviews = await reviewModel.find({ product: productId });

    if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: 0,
            ratingCount: 0,
        });
        return;
    }

    const ratingCount = reviews.length;
    
    const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0); 
    
    const ratingAverage = Number((totalStars / ratingCount).toFixed(2));

    await Product.findByIdAndUpdate(productId, {
        ratingAverage,
        ratingCount,
    });
};

const getProductReviews = catchError(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product id" });
    }

    const foundProduct = await Product.findById(productId);
    if (!foundProduct) {
        return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await reviewModel
        .find({ product: productId })
        .populate("user", "firstName lastName -_id") 
        .populate("product", "name -_id") 
        .sort({ createdAt: -1 });

    res.status(200).json({ message: "Reviews retrieved successfully", reviews });
});

const createReview = catchError(async (req, res) => {
    const { product, rating, comment } = req.body;
    const userId = req.user._id;

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
        return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await reviewModel.findOne({ user: userId, product});

    if (existingReview) {
        return res.status(409).json({ message: "You already reviewed this product" });
    }

    const review = await reviewModel.create({user: userId,product,rating,comment});

    await recalculateProductRating(product);

    res.status(201).json({
        message: "Review created successfully",
        review,
    });
});

const updateReview = catchError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid review id" });
    }

    const review = await reviewModel.findById(id);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id) {
        return res.status(403).json({ message: "You are not authorized to update this review" });
    }

    const updatedReview = await reviewModel.findByIdAndUpdate(
        id,{rating: req.body.rating, comment: req.body.comment},{new: true,}
    );

    await recalculateProductRating(review.product);

    res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
    });
});

const deleteReview = catchError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid review id" });
    }

    const review = await reviewModel.findById(id);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id;
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        return res
            .status(403)
            .json({ message: "You are not authorized to delete this review" });
    }

    await reviewModel.findByIdAndDelete(id);

    await recalculateProductRating(review.product);

    res.status(200).json({ message: "Review deleted successfully" });
});

export { createReview, updateReview, deleteReview, getProductReviews };
