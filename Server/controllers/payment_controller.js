
const { productModel } = require("../models/product_model.js");

const PaymentModel = require("../models/payment_model.js");
const orderModel = require("../models/order_model.js");

const cartModel = require("../models/cart_model.js");


const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createOrder = async (req, res, next) => {
    try {
        const prod = await productModel.findById(req.params.id);
        // console.log(prod);

        if (!prod) {
            return res.status(404).json({ message: "Product not found" });
        }

        const option = {
            amount: prod.price * 100, // Amount in paise
            currency: "INR",
            receipt: prod._id.toString(),
        }

        const order = await razorpay.orders.create(option);
        res.status(200).json({ message: "Order created successfully", order });

        const payment = await PaymentModel.create({
            order: order.id,
            amount: option.amount,
            currency: option.currency,
            status: "pending"
        });

    } catch (err) {
        // next(err);
        console.log(err);
        return res.status(500).json({ message: "Failed to create order" });
    }
}

module.exports.verifyPayment = async (req, res, next) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils.js");

        const isValid = validatePaymentVerification({ order_id: orderId, payment_id: paymentId }, signature, secret);

        if (!isValid) {
            const payment = await PaymentModel.findOne({ order: orderId });

            payment.status = "Failed";

            return res.status(400).json({ message: "Payment Verification Failed" });
        }

        const payment = await PaymentModel.findOne({ order: orderId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found, Try again later" });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = "Success";
        await payment.save();


        return res.status(200).json({ message: "Payment verified successfully" });


    } catch (err) {
        // next(err);
        return res.status(500).json({ message: "Failed to verify payment" });
    }
}

module.exports.createCartOrder = async (req, res, next) => {
    try {
        const cart = await cartModel.findOne({ user: req.user._id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty, Failed to initiate order" });
        }

        const totalAmount = cart.products.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        const options = await orderModel.create({
            user: req.user._id,
            cart: cart._id,
            amount: totalAmount,
            currency: "INR",
            receipt: cart._id.toString(),
            status: "pending"
        });

        const order = await razorpay.orders.create(options);
        res.status(200).json({ message: "Order created successfully", order });

        const payment = await PaymentModel.create({
            order: order.id,
            amount: options.amount,
            currency: options.currency,
            status: "pending"
        });

        return res.status(200).json({ message: "Cart order initiated successfully", cart, totalAmount });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create order from cart,Try again later" });
    }
}

// module.exports.verifyCartPayment = async (req, res, next) => {
//     try {
//         const { paymentId, orderId, signature } = req.body;
//         const secret = process.env.RAZORPAY_KEY_SECRET;


//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Failed to verify cart payment, Try again later" });
//     }
// }