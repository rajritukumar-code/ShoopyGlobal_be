// Importing express to create the server and handle routes
import express from "express";
// Importing CORS to handle cross-origin requests
import cors from "cors";

// Importing mongoose to interact with MongoDB
import mongoose from "mongoose";

// Importing dotenv to manage environment variables
import dotenv from "dotenv";

// Importing user routes
import { userRoutes } from "./routes/user.routes.js";

// Importing product routes
import { productRoutes } from "./routes/product.routes.js";

// Importing cart routes
import { cartRoutes } from "./routes/cart.routes.js";

// Importing error handling middlewares
import {
  globalErrorHandler,
  invalidRouteHandler,
  malformedJSONHandler,
  mongooseValidationHandler,
} from "./middlewares/errorHandlers.js";

// Initialize the Express application to handle HTTP requests
const app = express();

// Using CORS middleware to allow cross-origin requests
app.use(cors());

// Setting up dotenv to use environment variables
dotenv.config();

// Setting the port for the server to listen on
const PORT = process.env.PORT || 5050;

// Setting a limit of 1mb for JSON payloads to prevent large requests
app.use(express.json({ limit: "1mb" }));

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch((err) => console.log(err));

// Registering user routes
userRoutes(app);

// Registering product routes
productRoutes(app);

// Registering cart routes
cartRoutes(app);

// Middleware to handle malformed JSON requests
app.use(malformedJSONHandler);

// Middleware to handle mongoose validations
app.use(mongooseValidationHandler);

// Middleware to handle requests to undefined routes (404 Not Found)
app.use(invalidRouteHandler);

// Global error handling middleware (500 Internal Server Error or Unexpected errors)
app.use(globalErrorHandler);

// Listening on PORT and logging the server status
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
