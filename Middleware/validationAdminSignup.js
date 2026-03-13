import { adminSignupSchema } from "../Validation/user.validation.js";

const validationAdminSignup = (req, res, next) => {
  const validation = adminSignupSchema.validate(req.body);
  if (validation.error) {
    return res
      .status(422)
      .json({ message: validation.error.details[0].message });
  }
  next();
};

export default validationAdminSignup;

