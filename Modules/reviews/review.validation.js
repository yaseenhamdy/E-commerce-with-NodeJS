import joi from 'joi';

export const createReviewSchema = joi.object({
    product: joi.string().hex().length(24).required().messages({
        "any.required": "Product ID is required"
    }),
    rating: joi.number().min(1).max(5).required().messages({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating must be at most 5",
        "number.empty": "Rating is required"
    }),
    comment: joi.string().required().messages({
        "string.empty": "Comment is required"
    })
});

export const updateReviewSchema = joi.object({
    id: joi.string().hex().length(24).required().messages({
        "any.required": "Review ID is required",
        "string.length": "Invalid review ID"
    }),
    rating: joi.number().min(1).max(5).messages({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating must be at most 5",
        "number.empty": "Rating cannot be empty"
    }),
    comment: joi.string().messages({
        "string.empty": "Comment cannot be empty"
    })
})