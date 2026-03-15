import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import { ROLES } from "../../Constants/roles.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import {
    createCategoryValidation,
    updateCategoryValidation,
    getCategoryValidation
} from "./category.validation.js";

const categoryRoutes = express.Router();



categoryRoutes.get("/categories", getAllCategories);
categoryRoutes.get("/categories/:id", validationMiddleware(getCategoryValidation), getCategoryById);


categoryRoutes.post(
    "/categories",
    verifyToken,
    authorize(ROLES.ADMIN),
    validationMiddleware(createCategoryValidation),
    createCategory
);

categoryRoutes.put(
    "/categories/:id",
    verifyToken,
    authorize(ROLES.ADMIN),
    validationMiddleware(updateCategoryValidation),
    updateCategory
);

categoryRoutes.delete(
    "/categories/:id",
    verifyToken,
    authorize(ROLES.ADMIN),
    validationMiddleware(getCategoryValidation),
    deleteCategory
);

export default categoryRoutes;
