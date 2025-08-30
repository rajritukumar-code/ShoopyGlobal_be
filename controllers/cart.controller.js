import Cart from "../models/Cart.model.js";
import ProductModel from "../models/Product.model.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Controller function to add a product to the user's cart
export const addCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    const product = await ProductModel.findById(productId);
    // Check if the product exists
    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID '${productId}' you are trying to add does not exist.`
      );
    }
    // Check if the product is in stock
    if (!product.stock > 0) {
      return sendErrorResponse(
        res,
        400,
        "Insufficient Stock",
        `The product with ID '${productId}' is out of stock. Please try again later.`
      );
    }
    // check if the product is already in the user's cart
    let isNew = false;
    let cart = await Cart.findOne({ userId });

    // If the cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      // If the cart exists, check if the product is already in the cart
      const index = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index > -1) {
        const currentQuantity = cart.products[index].quantity;
        // If the product is already in the cart, check if the quantity exceeds stock
        if (currentQuantity >= product.stock) {
          return sendErrorResponse(
            res,
            400,
            "Stock Limit Reached",
            `Current quantity in cart: ${currentQuantity}, stock available: ${product.stock}.`
          );
        }

        cart.products[index].quantity = currentQuantity + 1;
      } else {
        // If the product is not in the cart, add it with quantity 1
        isNew = true;
        cart.products.push({ productId, quantity: 1 });
      }
    }

    // Save the cart with the new or updated product
    await cart.save();
    // Find the added or updated product in the cart
    const addedCartItem = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    return sendSuccessResponse(
      res,
      !isNew ? 200 : 201,
      { productId: addedCartItem.productId, quantity: addedCartItem.quantity },
      !isNew
        ? "Product quantity updated in cart successfully"
        : "Product added to cart successfully"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Controller function to retrieve the user's cart
export const getCartByUser = async (req, res, next) => {
  try {
    // Get the user ID from the request
    const userId = req.user._id;
    // Find the cart for the user and populate product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "-__v -createdAt -updatedAt",
    });
    // If the cart is not found return an error
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        "You don't have a cart yet. Please add items to create cart first."
      );
    }
    // If the cart is empty, return an error
    if (cart.products.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Cart Empty",
        "Your cart is empty. Please add items to your cart first."
      );
    }
    // Format the products in the cart for the response
    const formattedProducts = cart.products.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    // Filter out any products that are null or undefined
    const filteredProducts = formattedProducts.filter(
      (item) => item.product !== null && item.product !== undefined
    );

    // If no valid products are found, return an error
    if (filteredProducts.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "No Products Found",
        "Your cart does not contain any valid products."
      );
    }
    // Return the cart with valid populated product details
    return sendSuccessResponse(res, 200, filteredProducts);
  } catch (err) {
    next(err);
  }
};

// Controller function to increase the quantity of a product in the user's cart
export const increaseProductQuantity = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;
    // Find the product by ID
    const product = await ProductModel.findById(productId);

    // If the product does not exist, return an error
    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID ${productId} you are trying to update does not exist.`,

        `No product found with ID ${productId} in cart`
      );
    }
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // If the cart does not exist, return an error
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        "You don't have a cart yet. Please add items to create cart first."
      );
    }
    // If the cart is empty, return an error
    if (cart.products.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Cart Empty",
        "Your cart is empty. Please add items to your cart first."
      );
    }
    // Find the index of the product in the cart
    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If the product is not found in the cart, return an error
    if (index === -1) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID '${productId}' you are trying to update does not exist in your cart.`
      );
    }
    // Check if the product quantity exceeds stock
    const currentQuantity = cart.products[index].quantity;
    if (currentQuantity >= product.stock) {
      return sendErrorResponse(
        res,
        400,
        "Stock Limit Reached",
        `Current quantity in cart: ${currentQuantity}, stock available: ${product.stock}.`
      );
    }
    // if the quantity is less than stock, increment it by 1
    cart.products[index].quantity += 1;

    // Save the updated cart
    await cart.save();

    // Return the updated product details
    return sendSuccessResponse(
      res,
      200,
      cart.products[index],
      "Incremented product quantity successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Controller function to decrease the quantity of a product in the user's cart
export const decreaseProductQuantity = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;
    // Find the product by ID
    const product = await ProductModel.findById(productId);
    if (!product) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID ${productId} you are trying to update does not exist.`,

        `No product found with ID ${productId} in cart`
      );
    }
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        "You don't have a cart yet. Please add items to create cart first."
      );
    }

    // If the cart is empty, return an error
    if (cart.products.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Cart Empty",
        "Your cart is empty. Please add items to your cart first."
      );
    }

    // Check if the product exists in the cart
    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If the product is not found in the cart, return an erroR
    if (index === -1) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID '${productId}' you are trying to update does not exist in your cart.`
      );
    }
    // If the quantity is 1, we cannot decrease it further
    if (cart.products[index].quantity <= 1) {
      return sendErrorResponse(
        res,
        400,
        "Minimum Quantity Reached",
        `Cannot decrease quantity, minimum quantity is 1.`
      );
    }
    // if the quantity is greater than 1, decrease it by 1
    cart.products[index].quantity -= 1;
    await cart.save();
    // Return the updated product details
    return sendSuccessResponse(
      res,
      200,
      cart.products[index],
      "Decremented product quantity successfully"
    );
  } catch (err) {
    next(err);
  }
};

// Controller function to delete a product from the user's cart
export const deleteCartItem = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        "You don't have a cart yet. Please add items to create cart first."
      );
    }
    // If the cart is empty, return an error
    if (cart.products.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Cart Empty",
        "Your cart is empty. Please add items to your cart first."
      );
    }
    // Find the index of the product in the cart
    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If the product is not found in the cart, return an error
    if (index === -1) {
      return sendErrorResponse(
        res,
        404,
        "Product Not Found",
        `The product with ID '${productId}' you are trying to delete does not exist in your cart.`
      );
    }
    // If the product is found, remove it from the cart
    cart.products.splice(index, 1);
    await cart.save();
    // Return a success response
    return sendSuccessResponse(
      res,
      200,
      null,
      "Deleted Cart Item SuccessFully"
    );
  } catch (err) {
    next(err);
  }
};

// Controller function to delete all items from the user's cart
export const deleteAllCartItems = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // If the cart does not exist, return an error
    if (!cart) {
      return sendErrorResponse(
        res,
        404,
        "Cart Not Found",
        "You don't have a cart yet. Please add items to create cart first."
      );
    }

    // If the cart is empty, return an error
    if (cart.products.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Cart Empty",
        "Your cart is already empty. Please add items to your cart first."
      );
    }

    // Delete the products in the cart
    cart.products = [];
    await cart.save();

    // Return a success response
    return sendSuccessResponse(
      res,
      200,
      null,
      "Your cart has been cleared successfully."
    );
  } catch (err) {
    next(err);
  }
};
