import express from "express";

import { getCartItems } from "./cart.controller.js";

let cartRoutes = express.Router();

cartRoutes.get("/cart" , getCartItems)

export default cartRoutes