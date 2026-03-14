import express from "express";
import { addToWishList , deleteWishList} from '../wishList/wishList.controller.js'
import verifyToken from '../../Middleware/verifyToken.js'
import validationMiddleware from "../../Middleware/validationMiddleware.js";
import { WishlistShema } from './wishList.validation.js'

let wishListRoutes = express.Router()

wishListRoutes.post('/wishlist', verifyToken, validationMiddleware(WishlistShema), addToWishList)
wishListRoutes.delete('/wishlist' , verifyToken , validationMiddleware(WishlistShema) , deleteWishList)

export default wishListRoutes

