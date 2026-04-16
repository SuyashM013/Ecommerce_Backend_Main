const express = require('express');
const router = express.Router();

const userController = require("../controllers/user_controller");


router.get("/", userController.check);
router.post("/signup", userController.signup);
router.post("/login", userController.signin);
router.post("/logout", userController.logout);

module.exports = router;