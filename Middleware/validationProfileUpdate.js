import { userProfileUpdateSchema } from "../Validation/user.validation.js";

const validationProfileUpdate = (req, res, next) => {
  const validation = userProfileUpdateSchema.validate(req.body);
  if (validation.error) {
    return res
      .status(422)
      .json({ message: validation.error.details[0].message });
  }
  next();
};

export default validationProfileUpdate;

