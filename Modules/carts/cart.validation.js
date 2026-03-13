import Joi from "joi";


export const createCartSchema= Joi.object({
    product : Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).optional(),
    price : Joi.number().required()

});