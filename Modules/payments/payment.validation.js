import joi from "joi";

export const createCheckoutSessionSchema = joi.object({
    orderId: joi.string().hex().length(24).required().messages({
        "any.required": "Order ID is required",
        "string.length": "Invalid order ID"
    }),
    successUrl: joi.string().uri().optional().messages({
        "string.uri": "successUrl must be a valid URL"
    }),
    cancelUrl: joi.string().uri().optional().messages({
        "string.uri": "cancelUrl must be a valid URL"
    })
});

export const cashOnDeliverySchema = joi.object({
    orderId: joi.string().hex().length(24).required().messages({
        "any.required": "Order ID is required",
        "string.length": "Invalid order ID"
    })
});