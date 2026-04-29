const express = require('express');
const router = express.Router();

const userController = require("../controllers/user_controller");

const authMiddleware = require("../middlewares/auth_middleware")


router.get("/", userController.check);
router.post("/signup", userController.signup);
router.post("/login", userController.signin);
router.post("/logout", userController.logout);
router.get("/profile",authMiddleware.isAuthenticated, userController.getProfile);

router.get("/products", authMiddleware.isAuthenticated, userController.getMyProducts); // Get all products of the authenticated user

router.get("/products/:id", authMiddleware.isAuthenticated, userController.getProductById); // Get a specific product by ID for the authenticated user

router.get("/order/:id,", authMiddleware.isAuthenticated, userController.createOrder); // Create an order for a specific product by ID for the authenticated user
router.get("/verify/:id", authMiddleware.isAuthenticated, userController.verifyPayment); // Verify payment for a specific order by ID for the authenticated user

module.exports = router;