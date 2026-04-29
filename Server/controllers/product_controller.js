const { product, validateProduct } = require('../models/product_model');
const upload = require("../utils/multer_upload"); // Import the multer configuration from the utils folder
const cloudinary = require("cloudinary").v2;

const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ Error: "No files uploaded" });
        }

        const imageUrls = [];

        for (let file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }


        const error = validateProduct({ name, description, price, images: imageUrls, category, seller:req.user._id });

        if (error) {
            return res.status(400).json({ "Error from JOI: ": error });
        }

        // const uploadResult = await cloudinary.uploader.upload(req.file.path).catch((err) => {
        //     //console.log(err);
        //     return res.status(500).json({ Error: "Failed to upload file, Try Again" })
        // })


        // console.log("Received file:", req.file); // Log the uploaded file information
        console.log("Upload result:", imageUrls); // Log the uploaded file information


        const newProduct = await product.create({
            name: name,
            description: description,
            price: price,
            images: imageUrls,
            category: category,
            seller: req.user._id
        });


        for (let file of req.files) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(err);
                    // Not sending response here because we don't want to fail the entire request if file deletion fails
                } else {
                    console.log(`File ${file.filename} deleted successfully.`);
                }
            });
        }

        // fs.unlink(req.file.path, (err) => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(500).send('File could not be deleted or does not exist.');
        //     }
        //     // console.log(`File ${req.file.filename} deleted successfully.`);
        // });



        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        next(error);
    }
}