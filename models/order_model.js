const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    ],

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Order", orderSchema);