import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "./product.controller.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import { ROLES } from "../../Constants/roles.js";

const productRoutes = express.Router();


productRoutes.get("/products", getProducts);


productRoutes.get("/products/:id", getProductById);


productRoutes.post(
    "/products",
    verifyToken,
    authorize(ROLES.SELLER),
    createProduct
);

productRoutes.put(
    "/products/:id",
    verifyToken,
    authorize(ROLES.SELLER, ROLES.ADMIN),
    updateProduct
);


productRoutes.delete(
    "/products/:id",
    verifyToken,
    authorize(ROLES.SELLER, ROLES.ADMIN),
    deleteProduct
);

export default productRoutes;
