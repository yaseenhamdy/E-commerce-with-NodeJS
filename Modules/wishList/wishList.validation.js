import Joi from "joi";


export const WishlistShema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
});