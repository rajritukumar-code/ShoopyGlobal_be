// Importing jwt for token verification
import jwt from "jsonwebtoken";
// Importing the User model to verify the user associated with the token
import User from "../models/User.model.js";

// Importing utility function to send error responses
import { sendErrorResponse } from "../utils/sendErrorResponse.js";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header exists and is well-formed
  if (!authHeader || !authHeader.startsWith("JWT ")) {
    return sendErrorResponse(
      res,
      401,
      "Unauthorized",
      "Access token missing or malformed"
    );
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return sendErrorResponse(
          res,
          403,
          "Token Expired",
          "Your token has expired. Please log in again."
        );
      }
      return sendErrorResponse(
        res,
        403,
        "Invalid Token",
        "Access token is invalid. Please log in again."
      );
    }
    // If token is valid, find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendErrorResponse(
        res,
        404,
        "User Not Registered",
        "No user associated with this token. Please re-authenticate."
      );
    }

    // Attach the user to the request object for further processing
    req.user = user;
    next();
  });
};

export default verifyToken;
