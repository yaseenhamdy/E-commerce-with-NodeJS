import express from "express";
import {
  listUsers,
  signIn,
  signUp,
  verifyAccount,
  getUserAdmin,
  restrictUserAdmin,
  deleteUserAdmin,
} from "./user.controller.js";
import checkEmail from "../../Middleware/checkEmail.js";
import hashPassword from "../../Middleware/hashPassword.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationSignup from "../../Middleware/validationSignup.js";
import { ROLES } from "../../Constants/roles.js";
let userRoutes = express.Router();

userRoutes.get("/users", verifyToken, authorize(ROLES.ADMIN), listUsers);
userRoutes.get("/users/:id", verifyToken, authorize(ROLES.ADMIN), getUserAdmin);
userRoutes.patch(
  "/users/:id/restrict",
  verifyToken,
  authorize(ROLES.ADMIN),
  restrictUserAdmin,
);
userRoutes.delete(
  "/users/:id",
  verifyToken,
  authorize(ROLES.ADMIN),
  deleteUserAdmin,
);
userRoutes.post("/auth/signin", checkEmail, signIn);
userRoutes.post(
  "/auth/signup",
  validationSignup,
  checkEmail,
  hashPassword,
  signUp,
);

userRoutes.get("/auth/verify/:email", verifyAccount);

export default userRoutes;
