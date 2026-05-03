
const { usermodel, ValidateUser } = require("../models/user_model");
const blacklistModel = require("../models/blacklist_model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const paymentModel = require("../models/payment_model");
const orderModel = require("../models/order_model");

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const productModel = require("../models/product_model");

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const error = ValidateUser({ username, email, password, role });

        if (error) {
            return res.status(400).json({ message: error });

        }

        const existingUser = await usermodel.findOne({ email });

        if (existingUser) {

            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await usermodel.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
        })


        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });

        res.status(201).json({ message: "User registered successfully", user, token });



    } catch (err) {
        next(err);
    }
}

module.exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await usermodel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });


        res.status(200).json({ message: "User signed in successfully", user, token });

    } catch (err) {
        next(err);
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const isTokenBlacklisted = await blacklistModel.findOne({ token });

        if (isTokenBlacklisted) {
            return res.status(400).json({ message: "Token is already blacklisted" });
        }
        await blacklistModel.create({ token });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        next(err);
    }
}

module.exports.check = async (req, res, next) => {
    // res.send("User route is working").status(200);
    res.status(200).json({ message: "User route is working" });
}

module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await usermodel.findById(req.user._id);

        res.status(200).json({ message: "User profile retrieved successfully", user });



    } catch (err) {
        next(err);
    }
}


module.exports.getMyProducts = async (req, res, next) => {
    try {
        const prod = await productModel.find();

        res.status(200).json({ message: "Products retrieved successfully", products: prod });

    } catch (err) {
        next(err);
        res.status(500).json({ message: "Failed to retrieve products" });
    }
} // All products fetch

module.exports.getProductById = async (req, res, next) => {
    try {
        const prod = await productModel.findById(req.params.id);

        if (!prod) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ prod });


    } catch (err) {
        next(err);
        res.status(500).json({ message: "Failed to retrieve product" });
    }
} // Single product fetch by ID

module.exports.createOrder = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);

        const option = {
            amount: product.price * 100, // Amount in paise
            currency: "INR",
            receipt: product._id,


        }

        const order = await razorpay.orders.create(option);
        res.status(200).json({ message: "Order created successfully", order });

        const payment = await paymentModel.create({
            order: order.id,
            amount: option.amount,
            currency: option.currency,
            status: "pending",
        });

    } catch (err) {
        next(err);
        res.status(500).json({ message: "Failed to create order" });
    }
}

module.exports.verifyPayment = async (req, res, next) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const { validatePaymentVerification } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");

        const isValid = validatePaymentVerification({ order_id: orderId, payment_id: paymentId }, signature, secret);

        if (!isValid) {
            const payment = await paymentModel.findOne({ order: orderId });

            payment.status = "Failed";

            return res.status(400).json({ message: "Payment Verification Failed" });
        }

        const payment = await paymentModel.findOne({ order: orderId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found, Try again later" });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = "Success";
        await payment.save();


        res.status(200).json({ message: "Payment verified successfully" });


    } catch (err) {
        next(err);
        res.status(500).json({ message: "Failed to verify payment" });
    }
}