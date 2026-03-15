import Joi from "joi";

const createPromocodeSchema = Joi.object({
  code: Joi.string().uppercase().required().messages({
    "string.base": "Code must be a string",
    "string.empty": "Code is required",
    "any.required": "Code is required"
  }),
  discountPercentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "Discount percentage must be a number",
    "number.min": "Discount percentage must be at least 0",
    "number.max": "Discount percentage must be at most 100",
    "any.required": "Discount percentage is required"
  }),
  expirationDate: Joi.date().greater("now").optional().messages({
    "date.base": "Expiration date must be a valid date",
    "date.greater": "Expiration date must be in the future"
  }),
  usageLimit: Joi.number().min(1).optional().messages({
    "number.base": "Usage limit must be a number",
    "number.min": "Usage limit must be at least 1"
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean"
  })
});

const updatePromocodeSchema = Joi.object({
  code: Joi.string().uppercase().optional().messages({
    "string.base": "Code must be a string",
    "string.empty": "Code cannot be empty"
  }),
  discountPercentage: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Discount percentage must be a number",
    "number.min": "Discount percentage must be at least 0",
    "number.max": "Discount percentage must be at most 100"
  }),
  expirationDate: Joi.date().greater("now").optional().messages({
    "date.base": "Expiration date must be a valid date",
    "date.greater": "Expiration date must be in the future"
  }),
  usageLimit: Joi.number().min(1).optional().messages({
    "number.base": "Usage limit must be a number",
    "number.min": "Usage limit must be at least 1"
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean"
  })
}).unknown(true);

export { createPromocodeSchema, updatePromocodeSchema };