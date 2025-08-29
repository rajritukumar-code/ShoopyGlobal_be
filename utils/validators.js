// email and password validation regex patterns
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

// Function to check if a value is a non-empty string
export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;


// Function to check if a value is a positive number
export const isPositiveInteger = (value) =>
  typeof value === "number" && value > 0 && Number.isInteger(value);
// Function to check if a value is a number
export const isNumber = (value) => typeof value === "number" && value > 0;

// Email and password validation functions
export const isValidEmail = (email) => emailRegex.test(email.trim());
export const isValidPassword = (password) =>
  passwordRegex.test(password.trim());

// Function to check if a value is a valid name (at least 2 characters long)
export const isValidName = (name) => name.trim().length >= 2;

// Function to check if the body is a valid JSON object
export const isValidObject = (body) => {
  return (
    body !== undefined &&
    body !== null &&
    typeof body === "object" &&
    Object.getPrototypeOf(body) === Object.prototype
  );
};
