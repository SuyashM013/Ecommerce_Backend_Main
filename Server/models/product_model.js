const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters"],
        maxlength: [100, "Product name cannot exceed 100 characters"],
        index: true,
    },

    description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [10, "Description should be meaningful"],
    },

    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },

    images: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],

    category: {
        type: String,
        required: [true, "Product category is required"],
        lowercase: true,
        trim: true,
        index: true,
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Seller is required"],
        index: true,
    },

    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"],
    },

    ratingsAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    ratingsCount: {
        type: Number,
        default: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

// 🔍 compound index (important for filtering)
productSchema.index({ category: 1, price: 1 });


const validateProduct = (product) => {
    const schemajoi = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                "string.empty": "Product name is required",
            }),

        description: Joi.string()
            .min(10)
            .required()
            .messages({
                "string.empty": "Description is required",
            }),

        price: Joi.number()
            .min(0)
            .required()
            .messages({
                "number.base": "Price must be a number",
            }),

        images: Joi.array()
            .items(Joi.string().uri().required())
            .min(1)
            .required()
            .messages({
                "array.min": "At least one image is required",
            }),

        // images: Joi.string().required().messages({
        //     "string.empty": "Image URL is required",
        // }),

        category: Joi.string()
            .required()
            .messages({
                "string.empty": "Category is required",
            }),

        seller: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required()
            .messages({
                "any.invalid": "Invalid seller ID",
            }),

        stock: Joi.number().min(0).optional(),

        isActive: Joi.boolean().optional(),

    })

    let { error } = schemajoi.validate(product);
    if (error) {
        return error.details[0].message;
    }
}

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, validateProduct };