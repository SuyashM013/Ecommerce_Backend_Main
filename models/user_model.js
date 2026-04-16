const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        lowercase: true,
        index: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        index: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false, // 🔐 hide password by default
    },

    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user",
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    lastLogin: {
        type: Date,
    },
},
    {
        timestamps: true,
        versionKey: false, // cleaner response
    }
);

const ValidateUser = (user) => {
    const schemajoi = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .alphanum()
            .required()
            .messages({
                "string.empty": "Username is required",
                "string.min": "Username must be at least 3 characters",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "JOI: Invalid email format",
            }),

        password: Joi.string()
            .min(6)
            .max(50)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one uppercase, one lowercase, and one number",
            }),

        role: Joi.string()
            .valid("user", "seller")
            .optional(),
    });

    let { error } = schemajoi.validate(user);
    if (error) {
        return error.details[0].message;
    }
    // return schemajoi.validate(user);
}

const usermodel = mongoose.model("User", userSchema);
module.exports = { usermodel, ValidateUser };
