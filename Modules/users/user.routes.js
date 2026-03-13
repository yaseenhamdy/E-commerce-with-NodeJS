import express from "express";
import {
  listUsers,
  signIn,
  signUp,
  adminSignUp,
  verifyAccount,
  getUserAdmin,
  restrictUserAdmin,
  deleteUserAdmin,
  getUserProfile,
  updateUserProfile,
} from "./user.controller.js";
import checkEmail from "../../Middleware/checkEmail.js";
import hashPassword from "../../Middleware/hashPassword.js";
import verifyToken from "../../Middleware/verifyToken.js";
import authorize from "../../Middleware/authorization.js";
import validationSignup from "../../Middleware/validationSignup.js";
import validationProfileUpdate from "../../Middleware/validationProfileUpdate.js";
import validationAdminSignup from "../../Middleware/validationAdminSignup.js";
import { ROLES } from "../../Constants/roles.js";
let userRoutes = express.Router();

userRoutes.get("/user/profile", verifyToken, getUserProfile);
userRoutes.put(
  "/user/profile",
  verifyToken,
  validationProfileUpdate,
  hashPassword,
  updateUserProfile,
);

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
userRoutes.post(
  "/auth/admin/signup",
  verifyToken,
  authorize(ROLES.ADMIN),
  validationAdminSignup,
  hashPassword,
  adminSignUp,
);

userRoutes.get("/auth/verify/:email", verifyAccount);

export default userRoutes;
