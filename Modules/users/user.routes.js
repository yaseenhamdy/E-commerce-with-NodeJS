import express from "express";
import { listUsers, signIn, signUp, verifyAccount } from "./user.controller.js";
import checkEmail from "../../Middleware/checkEmail.js";
import hashPassword from "../../Middleware/hashPassword.js";
let userRoutes = express.Router();

userRoutes.get("/users", listUsers);
userRoutes.post("/auth/signin", checkEmail, signIn);
userRoutes.post("/auth/signup", checkEmail, hashPassword, signUp);
userRoutes.get("/auth/verify/:email", verifyAccount);

export default userRoutes;
