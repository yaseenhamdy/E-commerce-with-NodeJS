const validationMiddleware = (schema) => {
  return (req, res, next) => {

    const dataToValidate = { ...req.body, ...req.params, ...req.query };


    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {

      const errorMessages = error.details.map((err) => err.message);
      return res.status(422).json({ message: "Validation Error", errors: errorMessages });
    }

    next();
  };
};

export default validationMiddleware;
