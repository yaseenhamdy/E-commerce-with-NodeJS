import joi from "joi";


const objectIdValidation = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message("Invalid ObjectId format");
    }
    return value;
};

const createProductValidation = joi.object({
    name: joi.string().min(3).max(100).required().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 3 characters long",
        "string.max": "Product name cannot exceed 100 characters",
        "any.required": "Product name is required"
    }),
    description: joi.string().min(10).required().messages({
        "string.min": "Product description must be at least 10 characters long"
    }),
    price: joi.number().min(1).required().messages({
        "number.min": "Product price must be greater than 0"
    }),
    stock: joi.number().integer().min(1).required().messages({
        "number.min": "Product stock must be at least 1 when creating a product"
    }),
    category: joi.string().custom(objectIdValidation, "ObjectId validation").required().messages({
        "any.required": "Product category is required"
    }),
    imageUrl: joi.string().uri().optional().messages({
        "string.uri": "Invalid image URL format"
    }),
    isActive: joi.boolean().optional()
});

const updateProductValidation = joi.object({
    id: joi.string().custom(objectIdValidation, "ObjectId validation").required(),
    name: joi.string().min(3).max(100).optional(),
    description: joi.string().min(10).optional(),
    price: joi.number().min(1).optional(),
    stock: joi.number().integer().min(0).optional(),
    category: joi.string().custom(objectIdValidation, "ObjectId validation").optional(),
    imageUrl: joi.string().uri().optional(),
    isActive: joi.boolean().optional()
});

const getOrDeleteProductValidation = joi.object({
    id: joi.string().custom(objectIdValidation, "ObjectId validation").required()
});

const getProductsValidation = joi.object({
    category: joi.string().custom(objectIdValidation, "ObjectId validation").optional(),
    minPrice: joi.number().min(0).optional(),
    maxPrice: joi.number().min(0).optional(),
    search: joi.string().optional()
});

export {
    createProductValidation,
    updateProductValidation,
    getOrDeleteProductValidation,
    getProductsValidation
};
