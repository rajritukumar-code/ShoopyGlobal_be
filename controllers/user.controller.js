import User from "../models/User.model.js";
// Importing utility functions for generating tokens and sending responses
import generateToken from "../utils/generateToken.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Controller function to handle user registration
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is existing in the database

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendErrorResponse(
        res,
        409,
        "Email already registered",
        "The provided email is already in use. Please use a different email."
      );
    }
    // Create a new user if email is not registered
    const user = await User.create({
      name,
      email,
      password,
    });

    //Sending a success response with user details
    return sendSuccessResponse(
      res,
      201,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User Registered Successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Controller function to handle user login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });

    // If user does not exist, return an error response
    if (!user) {
      return sendErrorResponse(
        res,
        404,
        "Email Not registered",
        "No user exists with the provided email. Please register first."
      );
    }

    // If user exists, compare the provided password with the stored password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(
        res,
        401,
        "Invalid Credentials",
        "Incorrect password. Please try again.."
      );
    }
    // If user exists and password matches, generate a token
    const token = generateToken(user._id);
    return sendSuccessResponse(
      res,
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User Registered Successfully",
      token
    );
  } catch (error) {
    next(error);
  }
};
