import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getPendingProducts,
    approveProduct,
    getMyProducts
} from "./product.controller.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import { ROLES } from "../../Constants/roles.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import {
    createProductValidation,
    updateProductValidation,
    getOrDeleteProductValidation,
    getProductsValidation
} from "./product.validation.js";

const productRoutes = express.Router();

productRoutes.get("/products", validationMiddleware(getProductsValidation), getProducts);


productRoutes.get(
    "/products/pending",
    verifyToken,
    authorize(ROLES.ADMIN),
    getPendingProducts
);


productRoutes.get(
    "/products/my-products",
    verifyToken,
    authorize(ROLES.SELLER),
    getMyProducts
);

productRoutes.get("/products/:id", validationMiddleware(getOrDeleteProductValidation), getProductById);


productRoutes.post(
    "/products",
    verifyToken,
    authorize(ROLES.SELLER),
    validationMiddleware(createProductValidation),
    createProduct
);


productRoutes.patch(
    "/products/:id/approve",
    verifyToken,
    authorize(ROLES.ADMIN),
    validationMiddleware(getOrDeleteProductValidation),
    approveProduct
);

productRoutes.put(
    "/products/:id",
    verifyToken,
    authorize(ROLES.SELLER, ROLES.ADMIN),
    validationMiddleware(updateProductValidation),
    updateProduct
);


productRoutes.delete(
    "/products/:id",
    verifyToken,
    authorize(ROLES.SELLER, ROLES.ADMIN),
    validationMiddleware(getOrDeleteProductValidation),
    deleteProduct
);

export default productRoutes;
