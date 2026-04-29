const multer = require('multer');
const { v4: uuidv4 } = require("uuid");

const path = require('path')
// const uploadimg = path.join(__dirname, '././uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '././uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueSuffix = uuidv4();
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// ✅ file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    if (allowedTypes.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// ✅ multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

module.exports = upload;