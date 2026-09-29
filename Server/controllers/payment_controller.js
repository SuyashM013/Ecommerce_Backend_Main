
const { productModel } = require("../models/product_model.js");

const PaymentModel = require("../models/payment_model.js");
const orderModel = require("../models/order_model.js").default;
// import orderModel from "../models/order_model.js";
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

// module.exports.createCartOrder = async (req, res, next) => {
//     try {
//         const cart = await cartModel.findOne({ user: req.user._id }).populate("products.product");

//         if (!cart || cart.products.length === 0) {
//             return res.status(400).json({ message: "Cart is empty, Failed to initiate order" });
//         }

//         const totalAmount = cart.products.reduce((total, item) => {
//             return total + item.product.price * item.quantity;
//         }, 0);

//         const options = await orderModel.create({
//             user: req.user._id,
//             cart: cart._id,
//             amount: totalAmount,
//             currency: "INR",
//             receipt: cart._id.toString(),
//             status: "pending"
//         });

//         const order = await razorpay.orders.create(options);
//         console.log(order);

//         res.status(200).json({ message: "Order created successfully", order });

//         const payment = await PaymentModel.create({
//             order: order.id,
//             amount: options.amount,
//             currency: options.currency,
//             status: "pending"
//         });

//         return res.status(200).json({ message: "Cart order initiated successfully", cart, totalAmount });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Failed to create order from cart,Try again later" });
//     }
// }

// module.exports.createCartOrder = async (req, res, next) => {
//     try {
//         const cart = await cartModel
//             .findOne({ user: req.user._id })
//             .populate("products.product");

//         if (!cart || cart.products.length === 0) {
//             return res.status(400).json({
//                 message: "Cart is empty, failed to initiate order"
//             });
//         }

//         // Calculate total in INR
//         const totalAmount = cart.products.reduce((total, item) => {
//             return total + item.product.price * item.quantity;
//         }, 0);

//         // 1. Create order in our database
//         const dbOrder = await orderModel.create({
//             user: req.user._id,
//             cart: cart._id,
//             amount: totalAmount,
//             currency: "INR",
//             receipt: cart._id.toString(),
//             status: "pending"
//         });

//         // 2. Create Razorpay order
//         const razorpayOptions = {
//             amount: Math.round(totalAmount * 100), // INR → paise
//             currency: "INR",
//             receipt: dbOrder._id.toString()
//         };

//         const razorpayOrder = await razorpay.orders.create(
//             razorpayOptions
//         );

//         console.log("Razorpay Order:", razorpayOrder);

//         // 3. Save Razorpay order ID in our DB
//         dbOrder.razorpayOrderId = razorpayOrder.id;
//         await dbOrder.save();

//         // 4. Create payment record
//         await PaymentModel.create({
//             order: razorpayOrder.id,
//             amount: razorpayOptions.amount,
//             currency: razorpayOptions.currency,
//             status: "pending"
//         });

//         // 5. Send Razorpay order to frontend
//         return res.status(200).json({
//             message: "Cart order initiated successfully",
//             order: razorpayOrder,
//             dbOrderId: dbOrder._id,
//             cart,
//             totalAmount
//         });

//     } catch (err) {
//         console.log(err);

//         return res.status(500).json({
//             message: "Failed to create order from cart, try again later"
//         });
//     }
// };

module.exports.createCartOrder = async (req, res, next) => {
    try {
        const cart = await cartModel
            .findOne({ user: req.user._id })
            .populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: "Cart is empty, failed to initiate order"
            });
        }

        // Calculate cart total
        const totalAmount = cart.products.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        // Get product IDs
        const productIds = cart.products.map(
            item => item.product._id
        );

        // 1. Create order in our database
        const dbOrder = await orderModel.create({
            products: productIds,
            buyer: req.user._id,
            totalAmount: totalAmount,
            status: "pending"
        });

        // 2. Create Razorpay order
        const razorpayOptions = {
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: dbOrder._id.toString()
        };

        const razorpayOrder = await razorpay.orders.create(
            razorpayOptions
        );

        console.log("Razorpay Order:", razorpayOrder);

        // 3. Save Razorpay order ID
        dbOrder.razorpayOrderId = razorpayOrder.id;

        await dbOrder.save();

        // 4. Create Payment document
        const payment = await PaymentModel.create({
            order: razorpayOrder.id,
            amount: razorpayOptions.amount,
            currency: razorpayOptions.currency,
            status: "pending"
        });

        // 5. Attach payment to our order
        dbOrder.payment = payment._id;

        await dbOrder.save();

        // 6. Send response
        return res.status(200).json({
            message: "Cart order initiated successfully",
            order: razorpayOrder,
            dbOrderId: dbOrder._id,
            totalAmount
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to create order from cart, try again later"
        });
    }
};

// module.exports.verifyCartPayment = async (req, res, next) => {
//     try {
//         const { paymentId, orderId, signature } = req.body;

//         if (!paymentId || !orderId || !signature) {
//             return res.status(400).json({
//                 message: "Payment details are missing"
//             });
//         }

//         const secret = process.env.RAZORPAY_KEY_SECRET;

//         const {
//             validatePaymentVerification
//         } = require("razorpay/dist/utils/razorpay-utils.js");

//         // 1. Verify Razorpay signature
//         const isValid = validatePaymentVerification(
//             {
//                 order_id: orderId,
//                 payment_id: paymentId
//             },
//             signature,
//             secret
//         );

//         // 2. Find payment record
//         const payment = await PaymentModel.findOne({
//             order: orderId
//         });

//         if (!payment) {
//             return res.status(404).json({
//                 message: "Payment not found, try again later"
//             });
//         }

//         // 3. If signature is invalid
//         if (!isValid) {
//             payment.status = "failed";
//             await payment.save();

//             return res.status(400).json({
//                 message: "Payment verification failed"
//             });
//         }

//         // 4. Update payment
//         payment.paymentId = paymentId;
//         payment.signature = signature;
//         payment.status = "success";

//         await payment.save();

//         // 5. Find our MongoDB order
//         const order = await orderModel.findOne({
//             razorpayOrderId: orderId
//         });

//         if (!order) {
//             return res.status(404).json({
//                 message: "Order not found"
//             });
//         }

//         // 6. Update order status
//         order.status = "paid";
//         order.paymentId = paymentId;

//         await order.save();

//         // 7. Clear user's cart
//         await cartModel.findOneAndUpdate(
//             { user: req.user._id },
//             { $set: { products: [] } }
//         );


//         return res.status(200).json({
//             message: "Cart payment verified successfully",
//             order
//         });

//     } catch (err) {
//         console.log(err);

//         return res.status(500).json({
//             message: "Failed to verify cart payment, try again later"
//         });
//     }
// };

module.exports.verifyCartPayment = async (req, res, next) => {
    try {
        const { paymentId, signature } = req.body;

        const orderId = req.params.id;

        if (!paymentId || !signature || !orderId) {
            return res.status(400).json({
                message: "Payment details are missing"
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const {
            validatePaymentVerification
        } = require(
            "razorpay/dist/utils/razorpay-utils.js"
        );

        // 1. Verify Razorpay signature
        const isValid = validatePaymentVerification(
            {
                order_id: orderId,
                payment_id: paymentId
            },
            signature,
            secret
        );

        // 2. Find payment
        const payment = await PaymentModel.findOne({
            order: orderId
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        // 3. Invalid signature
        if (!isValid) {
            payment.status = "failed";
            await payment.save();

            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        // 4. Update payment
        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = "success";

        await payment.save();

        // 5. Find our MongoDB order
        const order = await orderModel.findOne({
            razorpayOrderId: orderId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // 6. Update order
        order.status = "paid";
        order.paymentId = paymentId;

        await order.save();

        // 7. Clear cart
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $set: { products: [] } }
        );

        return res.status(200).json({
            message: "Cart payment verified successfully",
            order
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to verify cart payment"
        });
    }
};