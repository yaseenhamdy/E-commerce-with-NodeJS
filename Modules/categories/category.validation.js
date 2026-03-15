import joi from "joi";


const objectIdValidation = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message("Invalid ObjectId format");
    }
    return value;
};

const createCategoryValidation = joi.object({
    name: joi.string().min(2).max(50).required().messages({
        "string.base": "Category name must be a string",
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters long",
        "string.max": "Category name cannot exceed 50 characters",
        "any.required": "Category name is required"
    }),
    isActive: joi.boolean().optional()
});

const updateCategoryValidation = joi.object({
    name: joi.string().min(2).max(50).optional(),
    isActive: joi.boolean().optional(),
    id: joi.string().custom(objectIdValidation, "ObjectId validation").required()
});

const getCategoryValidation = joi.object({
    id: joi.string().custom(objectIdValidation, "ObjectId validation").required()
});

export {
    createCategoryValidation,
    updateCategoryValidation,
    getCategoryValidation
};
