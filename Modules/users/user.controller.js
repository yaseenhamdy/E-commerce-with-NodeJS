import userModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../Email/email.js";
import catchError from "../../Middleware/catchError.js";
import { ROLES } from "../../Constants/roles.js";

const listUsers = catchError(async (req, res) => {
  let users = await userModel.find();
  res.json({ message: "Users retrieved successfully", users });
});

const signIn = catchError(async (req, res) => {
  const foundUser = req.foundUser;

  if (!foundUser.isActive) {
    return res.status(403).json({
      message: "Your account has been restricted. Please contact support.",
    });
  }

  const matchPassword = bcrypt.compareSync(
    req.body.password,
    foundUser.password,
  );

  if (matchPassword) {
    const token = jwt.sign(
      { _id: foundUser._id, role: foundUser.role, email: foundUser.email },
      process.env.JWT_SECRET,
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
  let addUser = await userModel.create(req.body);
  await sendEmail(req.body.email);
  addUser.password = undefined;
  res.json({ message: "User signed up successfully", user: addUser });
});

const adminSignUp = catchError(async (req, res) => {
  const existing = await userModel.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const createdAdmin = await userModel.create({
    ...req.body,
    role: ROLES.ADMIN,
  });

  await sendEmail(createdAdmin.email);
  createdAdmin.password = undefined;
  res.json({ message: "Admin signed up successfully", user: createdAdmin });
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
  let user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User retrieved successfully", user });
});

const restrictUserAdmin = catchError(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      message: "isActive must be a boolean value",
    });
  }

  const user = await userModel.findByIdAndUpdate(
    id,
    { isActive },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const message = isActive
    ? "User activated successfully"
    : "User restricted successfully";

  res.json({ message, user });
});

const deleteUserAdmin = catchError(async (req, res) => {
  let id = req.params.id;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted successfully" });
});

const getUserProfile = catchError(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.password = undefined;
  res.json({ message: "Profile retrieved successfully", user });
});

const updateUserProfile = catchError(async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "password",
    "role",
    "storeName",
    "storeDescription",
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const currentUser = await userModel.findById(req.user._id);
  if (!currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const emailChanged =
    updates.email &&
    updates.email.toLowerCase() !== currentUser.email.toLowerCase();

  if (updates.email) {
    const conflict = await userModel.findOne({
      email: updates.email,
      _id: { $ne: req.user._id },
    });
    if (conflict) {
      return res.status(409).json({ message: "Email already exists" });
    }
  }

  if (emailChanged) {
    updates.isEmailVerified = false;
  }

  const user = await userModel.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (emailChanged) {
    sendEmail(user.email).catch(() => {});
  }

  user.password = undefined;
  res.json({
    message: emailChanged
      ? "Profile updated successfully. Please verify your new email."
      : "Profile updated successfully",
    user,
  });
});
export {
  listUsers,
  signIn,
  signUp,
  adminSignUp,
  verifyAccount,
  getUserAdmin,
  restrictUserAdmin,
  deleteUserAdmin,
  getUserProfile,
  updateUserProfile,
};
