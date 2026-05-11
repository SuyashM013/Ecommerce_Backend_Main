const { productModel, validateProduct } = require('../models/product_model');
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

        // const tempresp = await fetch('https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json').then(res => res.json());

        // await Promise.all(
        //     tempresp.map(async (item) => {

        //         console.log(
        //             item.name,
        //             item.description,
        //             item.priceCents,
        //             item.category,
        //             item.image,
        //             item.rating.stars,
        //             item.rating.count
        //         );

        //         const result = await cloudinary.uploader.upload(item.image);

        //         console.log("Upload result:", result.secure_url);

        //         const newProduct = await productModel.create({
        //             name: item.name,
        //             description: item.description,
        //             price: item.priceCents,
        //             images: [result.secure_url],
        //             category: item.category,
        //             seller: "69f83be8673bc61ad7ddf1b8",
        //             stock: 50,
        //             ratingsAverage: item.rating.stars || 0,
        //             ratingsCount: item.rating.count || 0,
        //         });

        //         console.log("Saved:", newProduct.name);
        //     })
        // );

        // res.json({ message: "Products imported successfully" });



        const imageUrls = [];

        for (let file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }


        const error = validateProduct({ name, description, price, images: imageUrls, category, seller: req.user._id });

        if (error) {
            return res.status(400).json({ "Error from JOI: ": error });
        }


        console.log("Upload result:", imageUrls); // Log the uploaded file information


        const newProduct = await productModel.create({
            name: name,
            description: description,
            price: price,
            images: imageUrls,
            category: category,
            seller: req.user._id,
            stock: req.body.stock || 0,
            ratingsAverage: req.body.ratingsAverage || 0,
            ratingsCount: req.body.ratingsCount || 0,
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




        res.status(201).json({ message: "Product created successfully", product: newProduct });
        // res.status(201).json({ message: "Product created successfully", product: tempresp }); // Sending the first product from the fetched data as a response for testing
    } catch (error) {
        next(error);
    }
}