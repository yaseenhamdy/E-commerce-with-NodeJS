import Joi from "joi";


export const decreaseQuantitySchema= Joi.object({
    productId : Joi.string().hex().length(24).required(),
  

});