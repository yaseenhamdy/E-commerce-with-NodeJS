import express from "express";
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import { ROLES } from "../../Constants/roles.js";

const categoryRoutes = express.Router();

// الهدف من المسارات: تنظيم الوصول للعمليات بناءً على صلاحيات المستخدم.

// عرض الفئات متاح للجميع (Customer, Seller, Admin)
categoryRoutes.get("/categories", getAllCategories);

// العمليات التالية (إضافة، تعديل، حذف) مقتصرة فقط على المشرف (Admin)
categoryRoutes.post(
    "/categories",
    verifyToken,
    authorize(ROLES.ADMIN),
    createCategory
);

categoryRoutes.put(
    "/categories/:id",
    verifyToken,
    authorize(ROLES.ADMIN),
    updateCategory
);

categoryRoutes.delete(
    "/categories/:id",
    verifyToken,
    authorize(ROLES.ADMIN),
    deleteCategory
);

export default categoryRoutes;
