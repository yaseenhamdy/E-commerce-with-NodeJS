import express from "express";
import verifyToken from '../../Middleware/verifyToken.js'
import { addToCart , getUserCart } from "./cart.controller.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import {createCartSchema} from "../carts/cart.validation.js" 

let cartRoutes = express.Router();

cartRoutes.get("/cart/:userid" ,verifyToken ,getUserCart)
cartRoutes.post("/cart" ,verifyToken,validationMiddleware(createCartSchema) ,addToCart)

export default cartRoutes