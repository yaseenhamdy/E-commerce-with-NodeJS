import User from "../Modules/users/user.model.js";

const checkEmail = async (req, res, next) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (req.url === "/auth/signin") {
    if (foundUser) {
      req.foundUser = foundUser;
      next();
    } else {
      res.json({ message: "Email does not exist" });
    }
  }

  if (req.url === "/auth/signup") {
    if (foundUser) {
      res.json({ message: "Email already exists" });
    } else {
      next();
    }
  }
};

export default checkEmail;
