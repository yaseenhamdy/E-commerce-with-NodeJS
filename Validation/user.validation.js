import Joi from "joi";

// Signup: for customers & sellers only
const userValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(10).required().messages({
    "string.min": "First Name must be at least 3 characters long",
    "string.empty": "First Name is required",
  }),
  lastName: Joi.string().min(3).max(10).required().messages({
    "string.min": "Last Name must be at least 3 characters long",
    "string.empty": "Last Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid Email",
  }),
  password: Joi.string()
    .min(6)
    .max(10)
    .required()
    .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$"))
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "string.min": "Password must be at least 6 characters",
      "string.max": "The max length for a password is 10 characters",
    }),
  role: Joi.string().valid("customer", "seller").required().messages({
    "any.only": "Role must be either customer or seller",
    "string.empty": "Role is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{11}$/)
    .messages({
      "string.pattern.base": "Phone number must be 11 digits",
    }),

  isEmailVerified: Joi.boolean(),

  isActive: Joi.boolean(),

  stripeCustomerId: Joi.string(),

  wishlist: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .messages({
      "string.pattern.base":
        "Wishlist must be an array of valid MongoDB ObjectIds",
    }),

  storeName: Joi.string().min(3).max(50).messages({
    "string.min": "Store name must be at least 3 characters long",
    "string.max": "Store name must be at most 50 characters long",
  }),

  storeDescription: Joi.string().max(500).messages({
    "string.max": "Store description must be at most 500 characters",
  }),

  balance: Joi.number().min(0).messages({
    "number.min": "Balance cannot be negative",
  }),
});

// Profile update: partial, no role change requirement
export const userProfileUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(10),
  lastName: Joi.string().min(3).max(10),
  email: Joi.string().email().messages({
    "string.email": "Invalid Email",
  }),
  password: Joi.string()
    .min(6)
    .max(10)
    .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$"))
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "string.min": "Password must be at least 6 characters",
      "string.max": "The max length for a password is 10 characters",
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{11}$/)
    .messages({
      "string.pattern.base": "Phone number must be 11 digits",
    }),

  storeName: Joi.string().min(3).max(50).messages({
    "string.min": "Store name must be at least 3 characters long",
    "string.max": "Store name must be at most 50 characters long",
  }),

  storeDescription: Joi.string().max(500).messages({
    "string.max": "Store description must be at most 500 characters",
  }),
}).min(1);

// Admin signup: similar to signup but without role field (forced to admin in controller)
export const adminSignupSchema = Joi.object({
  firstName: Joi.string().min(3).max(10).required().messages({
    "string.min": "First Name must be at least 3 characters long",
    "string.empty": "First Name is required",
  }),
  lastName: Joi.string().min(3).max(10).required().messages({
    "string.min": "Last Name must be at least 3 characters long",
    "string.empty": "Last Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid Email",
  }),
  password: Joi.string()
    .min(6)
    .max(10)
    .required()
    .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$"))
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "string.min": "Password must be at least 6 characters",
      "string.max": "The max length for a password is 10 characters",
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{11}$/)
    .messages({
      "string.pattern.base": "Phone number must be 11 digits",
    }),
}).required();

export default userValidationSchema;
