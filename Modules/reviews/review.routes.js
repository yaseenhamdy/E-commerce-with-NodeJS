import express from "express";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import { ROLES } from "../../Constants/roles.js";
import { createReview, updateReview, deleteReview, getProductReviews } from "./review.controller.js";
import { createReviewSchema, updateReviewSchema } from "./review.validation.js";

const reviewRoutes = express.Router();

reviewRoutes.get("/products/:productId/reviews", getProductReviews);

reviewRoutes.post(
    "/reviews",
    verifyToken,
    authorize(ROLES.CUSTOMER),
    validationMiddleware(createReviewSchema),
    createReview,
);

reviewRoutes.put(
    "/reviews/:id",
    verifyToken,
    authorize(ROLES.CUSTOMER),
    validationMiddleware(updateReviewSchema),
    updateReview,
);

reviewRoutes.delete(
    "/reviews/:id",
    verifyToken,
    authorize(ROLES.CUSTOMER, ROLES.ADMIN),
    deleteReview,
);

export default reviewRoutes;