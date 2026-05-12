const authMiddleware = require('../middlewares/auth_middleware');

const router = require('express').Router();
const productController = require('../controllers/product_controller');

const upload = require("../utils/multer_upload"); // Import the multer configuration from the utils folder

// router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);

// router.post("/create-product", upload.single('images'), 
// createProduct);

router.get("/", productController.getMyProducts); // Get all products of the authenticated user

router.get("/:id", productController.getProductById); // Get a specific product by ID for the authenticated user


router.post("/create-product", authMiddleware.isAuthenticated, authMiddleware.isSeller, upload.array('images', 5), productController.createProduct);


module.exports = router;