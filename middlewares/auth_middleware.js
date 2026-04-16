const userModel = require("../models/user_model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist_model");

module.exports.isAuthenticated = async (req, res, next) => {
    // try {
    //     const token = req.headers.authorization?.split(" ")[1];
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     const user = await userModel.findById(decoded._id);

    //     if (!user) {
    //         return res.status(401).json({ message: "Unauthorized" });
    //     }

    //     req.user = user;
    //     next();

    // } catch (err) {
    //     next(err);
    // }
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const token = authHeader.split(" ")[1];

        // 🔥 check blacklist
        const isBlacklisted = await blacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is invalid" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await userModel.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }

}

module.exports.isSeller = (req, res, next) => {
    try {
        const user = req.user;
        if(!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden: Seller access required" });

        }
        next();

    } catch (err) {
        next(err);
    }
}