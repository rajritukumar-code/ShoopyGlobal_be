// importing mongoose to define the schema for the User model
import mongoose from "mongoose";

// Importing bcrypt for password hashing
import bcrypt from 'bcrypt';

// Importing regex patterns for email and password validation
import { emailRegex, passwordRegex } from "../utils/validators.js";

// Defining the schema for the User model

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"Name is required. Please enter full name."],
      trim: true,
      minlength: [2,"Name must be at least 2 characters long."]
    },
    email: {
      type: String,
      required: [true,"Email is required. Please enter email address."],
      unique: true,
      match: [emailRegex,"Please enter a valid email address. Please ensure it follows the standard format like: example@domain.com"]
    },
    password: {
      type: String,
      required: [true,"Password is required. Please enter password."],
      minlength:[6,"Password must be at least 6 characters long."],
      match: [passwordRegex, "Password must start with an uppercase letter, include lowercase letters, numbers, special characters, and be at least 6 characters long."],
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving the user document
// Used bcrypt to hash the password with a salt round of 10

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
