const express = require('express');
const router = express.Router();

const orderController = require("../controllers/order_controller");
const authMiddleware = require("../middlewares/auth_middleware") 

router.get("/order/:id", authMiddleware.isAuthenticated, userController.createOrder); // Create an order for a specific product by ID for the authenticated user

router.post("/verify/:id", authMiddleware.isAuthenticated, userController.verifyPayment); // Verify payment for a specific order by ID for the authenticated user

module.exports = router;