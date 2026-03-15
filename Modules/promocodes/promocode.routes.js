import express from "express";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import { ROLES } from "../../Constants/roles.js";
import {createPromocode,getPromocodes,getPromocodeById,updatePromocode,deletePromocode} from "./promocode.controller.js";
import { createPromocodeSchema, updatePromocodeSchema } from "./promocode.validation.js";

const promocodeRoutes = express.Router();

promocodeRoutes.post(
  "/promocodes",
  verifyToken,
  authorize(ROLES.ADMIN),
  validationMiddleware(createPromocodeSchema),
  createPromocode
);

promocodeRoutes.get(
  "/promocodes",
  verifyToken,
  authorize(ROLES.ADMIN),
  getPromocodes
);

promocodeRoutes.get(
  "/promocodes/:id",
  verifyToken,
  authorize(ROLES.ADMIN),
  getPromocodeById
);

promocodeRoutes.patch(
  "/promocodes/:id",
  verifyToken,
  authorize(ROLES.ADMIN),
  validationMiddleware(updatePromocodeSchema),
  updatePromocode
);

promocodeRoutes.delete(
  "/promocodes/:id",
  verifyToken,
  authorize(ROLES.ADMIN),
  deletePromocode
);

export default promocodeRoutes;