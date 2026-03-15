import joi from "joi";

export const createOrderSchema = joi.object({
  shippingAddress: joi
    .object({
      city: joi.string().trim().required().messages({
        "string.empty": "City is required",
        "any.required": "City is required",
      }),
      street: joi.string().trim().required().messages({
        "string.empty": "Street is required",
        "any.required": "Street is required",
      }),
      phone: joi
        .string()
        .trim()
        .pattern(/^01[0125][0-9]{8}$/)
        .required()
        .messages({
          "string.empty": "Phone is required",
          "any.required": "Phone is required",
          "string.pattern.base":
            "Phone must be a valid Egyptian mobile number (11 digits, starts with 010, 011, 012, or 015)",
        }),
    })
    .required()
    .messages({
      "any.required": "Shipping address is required",
    }),
});

export const updateOrderStatusSchema = joi.object({
  status: joi
    .string()
    .valid("pending", "paid", "shipped", "delivered", "canceled")
    .required()
    .messages({
      "any.only": "Invalid order status",
      "any.required": "Status is required",
      "string.empty": "Status is required",
    }),
});

export const updateItemStatusSchema = joi.object({
  itemId: joi.string().hex().length(24).required().messages({
    "any.required": "Item ID is required",
    "string.length": "Invalid item ID",
  }),
  itemStatus: joi
    .string()
    .valid("pending", "processing", "shipped", "delivered", "canceled")
    .required()
    .messages({
        "any.only": "Invalid item status",
        "any.required": "Item status is required",
        "string.empty": "Item status is required",
    }),
}); 