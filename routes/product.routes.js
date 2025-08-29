// Import controller functions to handle product operations
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  insertBulkProducts,
  updateProduct,
} from "../controllers/product.controller.js";

// Middleware to validate the request body for bulk product insertion
import { validateBulkProducts } from "../middlewares/validateBulkProducts.js";

// Middleware to validate MongoDB ObjectId format
import { validateObjectId } from "../middlewares/validateObjectId.js";

// Middleware to validate the request body for product creation and updates
import { validateProduct } from "../middlewares/validateProduct.js";

// Middleware to verify JWT token for protected routes
import verifyToken from "../middlewares/verifyToken.js";

// Function to define product-related routes
export function productRoutes(app) {
  // POST route to insert multiple products in bulk, requires token verification and validation of the request body
  app.post(
    "/api/products/bulk",
    verifyToken,
    validateBulkProducts,
    insertBulkProducts
  );

  // POST route to create a new product, requires token verification and validation of the request body
  app.post("/api/product", verifyToken, validateProduct, createProduct);

  // GET routes to retrieve all products or a specific product by ID, with validation of the product ID
  app.get("/api/products", getAllProducts);

  // GET route to retrieve a specific product by ID, requires validation of the product ID
  app.get("/api/products/:id", validateObjectId("params","id"), getProductById);

  // PUT and DELETE routes to update or delete a specific product by ID, requires token verification and validation of the product ID
  app.put("/api/products/:id", verifyToken, validateObjectId("params","id"), updateProduct);

  // DELETE route to remove a specific product by ID, requires token verification and validation of the product ID
  app.delete("/api/products/:id", verifyToken, validateObjectId("params","id"), deleteProduct);
}
