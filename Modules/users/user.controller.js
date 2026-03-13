import userModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../Email/email.js";
import catchError from "../../Middleware/catchError.js";

const listUsers = catchError(async (req, res) => {
  let users = await userModel.find();
  res.json({ message: "Users retrieved successfully", users });
});

const signIn = catchError(async (req, res) => {
  let foundUser = req.foundUser;
  let matchPassword = bcrypt.compareSync(req.body.password, foundUser.password);

  if (matchPassword) {
    let token = jwt.sign(
      { _id: foundUser._id, role: foundUser.role, email: foundUser.email },
      "iti",
    );
    foundUser.password = undefined;
    res.json({
      message: "User signed in successfully",
      user: foundUser,
      token,
    });
  } else {
    res.status(422).json({ message: "Invalid password or Email" });
  }
});

const signUp = catchError(async (req, res) => {
  let addUser = await userModel.insertOne(req.body);
  await sendEmail(req.body.email);
  addUser.password = undefined;
  res.json({ message: "User signed up successfully", user: addUser });
});

const verifyAccount = catchError(async (req, res) => {
  let emailToken = req.params.email;
  jwt.verify(emailToken, "emailToken", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    // user --> isConfirmed = true
    console.log(decoded);
    await userModel.findOneAndUpdate(
      { email: decoded },
      { isEmailVerified: true },
    );
    res.status(200).json({ message: "Account Verified Successfully" });
  });
});

const getUserAdmin = catchError(async (req, res) => {
  let id = req.params.id;
  let user = await userModel.find({ _id: id });
  res.json({ message: "User retrieved successfully", user });
});

const restrictUserAdmin = catchError(async (req, res) => {
  let id = req.params.id;
  const user = await userModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  res.json({ message: "User restricted successfully", user });
});

const deleteUserAdmin = catchError(async (req, res) => {
  let id = req.params.id;
  const user = await userModel.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
});
export {
  listUsers,
  signIn,
  signUp,
  verifyAccount,
  getUserAdmin,
  restrictUserAdmin,
  deleteUserAdmin,
};
