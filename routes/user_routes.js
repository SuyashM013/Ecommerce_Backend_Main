const express = require('express');
const router = express.Router();

const userController = require("../controllers/user_controller");

const authMiddleware = require("../middlewares/auth_middleware")


router.get("/", userController.check);
router.post("/signup", userController.signup);
router.post("/login", userController.signin);
router.post("/logout", userController.logout);
router.get("/profile",authMiddleware.isAuthenticated, userController.getProfile);

module.exports = router;