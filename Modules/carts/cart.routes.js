import express from "express";
import verifyToken from '../../Middleware/verifyToken.js'
import { addToCart , getUserCart ,deleteFromCart ,decreaseProductQuantity } from "./cart.controller.js";
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import {createCartSchema} from "../carts/cart.validation.js" 
import {decreaseQuantitySchema} from '../carts/decreaseQuantity.validation.js'

let cartRoutes = express.Router();

cartRoutes.get("/cart/:userid" ,verifyToken ,getUserCart)
cartRoutes.post("/cart" ,verifyToken,validationMiddleware(createCartSchema) ,addToCart)
cartRoutes.delete("/cart/:productId" , verifyToken , deleteFromCart)
cartRoutes.put("/cart" , verifyToken , validationMiddleware (decreaseQuantitySchema),decreaseProductQuantity)

export default cartRoutes