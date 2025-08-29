// Import the jsonwebtoken package to create JWT tokens
import jwt from "jsonwebtoken";

//Generates a JWT token for a given user ID with 1 day expiry.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default generateToken;