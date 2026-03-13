const validationMiddleware = (schema) => {
  return (req, res, next) => {

    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(422)
        .json({ message: error.details[0].message });
    }

    next();
  };
};

export default validationMiddleware;