const express = require('express');
const router = express.Router();

const cartController = require("../controllers/cart_controller");
const authMiddleware = require("../middlewares/auth_middleware")

// GET    /cart
// POST   /cart/add
// PUT    /cart/update/:id
// DELETE /cart/remove/:id
// DELETE /cart/clear

router.get("/", authMiddleware.isAuthenticated, cartController.getCart); // Get the authenticated user's cart

router.post("/add", authMiddleware.isAuthenticated, cartController.addToCart); // Add a product to the authenticated user's cart

router.put("/update/:id", authMiddleware.isAuthenticated, cartController.updateCartItem); // Update the quantity of a specific product in the authenticated user's cart

router.delete("/remove/:id", authMiddleware.isAuthenticated, cartController.removeFromCart); // Remove a specific product from the authenticated user's cart

router.delete("/clear", authMiddleware.isAuthenticated, cartController.clearCart); // Clear the authenticated user's cart

module.exports = router;