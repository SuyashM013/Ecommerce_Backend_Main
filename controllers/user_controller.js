
const { usermodel, ValidateUser } = require("../models/user_model");
const blacklistModel = require("../models/blacklist_model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const  error  = ValidateUser( {username, email, password, role} );

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
            expiresIn: "1h",
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