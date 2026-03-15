import express from "express";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import { ROLES } from "../../Constants/roles.js";
import {createOrder,getOrders,getOrderById,updateOrderStatus,updateItemStatus} from "./order.controller.js";
import {createOrderSchema,updateOrderStatusSchema,updateItemStatusSchema} from "./order.validation.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/orders",
  verifyToken,
  authorize(ROLES.CUSTOMER),
  validationMiddleware(createOrderSchema),
  createOrder
);

orderRoutes.get(
  "/orders",
  verifyToken,
  authorize(ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SELLER),
  getOrders
);

orderRoutes.get(
  "/orders/:id",
  verifyToken,
  authorize(ROLES.CUSTOMER, ROLES.ADMIN),
  getOrderById
);

orderRoutes.patch(
  "/orders/:id/status",
  verifyToken,
  authorize(ROLES.ADMIN),
  validationMiddleware(updateOrderStatusSchema),
  updateOrderStatus
);

orderRoutes.patch(
  "/orders/:id/item-status",
  verifyToken,
  authorize(ROLES.SELLER),
  validationMiddleware(updateItemStatusSchema),
  updateItemStatus
);

export default orderRoutes;