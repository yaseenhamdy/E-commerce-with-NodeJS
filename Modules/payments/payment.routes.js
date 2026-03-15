import express from "express";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import { ROLES } from "../../Constants/roles.js";
import {createCheckoutSession,selectCashOnDelivery,getMyPayments,getPaymentByOrderId,getPaymentById} from "./payment.controller.js";
import { createCheckoutSessionSchema, cashOnDeliverySchema } from "./payment.validation.js";

const paymentRoutes = express.Router();

paymentRoutes.post(
    "/payments/stripe/checkout-session",
    verifyToken,
    authorize(ROLES.CUSTOMER),
    validationMiddleware(createCheckoutSessionSchema),
    createCheckoutSession
);

paymentRoutes.post(
    "/payments/cash-on-delivery",
    verifyToken,
    authorize(ROLES.CUSTOMER),
    validationMiddleware(cashOnDeliverySchema),
    selectCashOnDelivery
);

paymentRoutes.get(
    "/payments/my",
    verifyToken,
    authorize(ROLES.CUSTOMER),
    getMyPayments
);

paymentRoutes.get(
    "/payments/order/:orderId",
    verifyToken,
    authorize(ROLES.CUSTOMER, ROLES.ADMIN),
    getPaymentByOrderId
);

paymentRoutes.get(
    "/payments/:paymentId",
    verifyToken,
    authorize(ROLES.CUSTOMER, ROLES.ADMIN),
    getPaymentById
);


export default paymentRoutes;