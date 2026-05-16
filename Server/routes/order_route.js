const express = require('express');
const router = express.Router();

const paymentController = require("../controllers/payment_controller");
const authMiddleware = require("../middlewares/auth_middleware")

router.get("/:id", authMiddleware.isAuthenticated, paymentController.createOrder); // Create an order for a specific product by ID for the authenticated user

router.post("/verify/:id", authMiddleware.isAuthenticated, paymentController.verifyPayment); // Verify payment for a specific order by ID for the authenticated user

router.get("/cart/:id", authMiddleware.isAuthenticated, paymentController.createCartOrder); // Get the cart for the authenticated user

// router.post("/cart/verify/:id", authMiddleware.isAuthenticated, paymentController.verifyCartPayment); // Verify payment for the authenticated user's cart



module.exports = router;