const { required } = require('joi');
const mongoose = require('mongoose');

const paymemtSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order is required"],
        index: true,
    },

    paymentId: {
        type: String,
        required: [true, "Payment ID is required"],
        unique: true,
        trim: true,
        index: true,
    },

    signature: {
        type: String,
        required: [true, "Signature is required"],
    },

    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
    },

    currency: {
        type: String,
        required: [true, "Currency is required"],
        uppercase: true,
        trim: true,
        default: "INR",
    },

    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
        index: true,
    },

    // method: {
    //     type: String,
    //     enum: ["card", "upi", "netbanking", "wallet"],
    // },
    paidAt: {
        type: Date,
    },

    failureReason: {
        type: String,
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

const validatePayment = (payment) => {
    const schema = Joi.object({
        order: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .messages({
                "any.invalid": "Invalid Order ID",
            }),

        paymentId: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Payment ID is required",
            }),

        signature: Joi.string()
            .required()
            .messages({
                "string.empty": "Signature is required",
            }),

        amount: Joi.number()
            .min(0)
            .required()
            .messages({
                "number.base": "Amount must be a number",
            }),

        currency: Joi.string()
            .uppercase()
            .length(3)
            .required()
            .messages({
                "string.length": "Currency must be 3 characters (e.g., INR)",
            }),

        status: Joi.string()
            .valid("pending", "completed", "failed")
            .optional(),

        method: Joi.string()
            .valid("card", "upi", "netbanking", "wallet")
            .optional(),

        failureReason: Joi.string().optional(),
    })

    let { error } = schema.validate(payment);
    if (error) {
        return error.details[0].message;
    }
}

const Payment = mongoose.model("Payment", paymemtSchema);

module.exports = {
    Payment,
    validatePayment,
}