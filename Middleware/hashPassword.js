import bcrypt from "bcrypt";

let hashPassword = (req, res, next) => {
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }
  next();
};

export default hashPassword;
