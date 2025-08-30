// Importing utility functions for sending error responses and validating user fields
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import {
  isNonEmptyString,
  isValidEmail,
  isValidName,
  isValidObject,
  isValidPassword,
} from "../utils/validators.js";

// Middleware to validate user registration and login requests
export const validateRegisterUser = (req, res, next) => {
  if (!isValidObject(req.body)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Request",
      "Request body is required and must be a plain JSON object."
    );
  }

  const { name, email, password } = req.body;
  // Check if all required fields are present and valid
  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(password)
  ) {
    // If any required field is missing or empty, return an error response
    return sendErrorResponse(
      res,
      400,
      "Missing Required Fields",
      "Name, Email, Password are required. Please enter all the fields to register"
    );
  }
  // Validate name, email, and password formats
  if (!isValidName(name)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Name",
      "Name must be at least 2 characters long."
    );
  }

  if (!isValidEmail(email)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Email",
      "Please enter a valid email address. Please ensure it follows the standard format like: example@domain.com"
    );
  }

  if (!isValidPassword(password)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Password",
      "Password must start with an uppercase letter, include lowercase letters, numbers, special characters, and be at least 6 characters long."
    );
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};

// Middleware to validate user login requests

export const validateLoginUser = (req, res, next) => {
  if (!isValidObject(req.body)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Request",
      "Request body is required and must be a plain JSON object."
    );
  }

  const { email, password } = req.body;
  // Check if email and password are provided and valid
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return sendErrorResponse(
      res,
      400,
      "Missing Required Fields",
      "Email, Password are required. Please enter all the fields to login"
    );
  }

  if (!isValidEmail(email)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid Email",
      "Please enter a valid email address. Please ensure it follows the standard format like: example@domain.com"
    );
  }

  // All validations passed
  next();
};
