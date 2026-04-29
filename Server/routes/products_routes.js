const authMiddleware = require('../middlewares/auth_middleware');

const router = require('express').Router();
const { createProduct } = require('../controllers/product_controller');

const upload = require("../utils/multer_upload"); // Import the multer configuration from the utils folder

router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);

// router.post("/create-product", upload.single('images'), createProduct);
router.post("/create-product", upload.array('images', 5), createProduct);



module.exports = router;