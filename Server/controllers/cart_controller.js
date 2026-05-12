const cartModel = require("../models/cart_model");
const { productModel } = require("../models/product_model");

module.exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartModel
            .findOne({ user: req.user._id })
            .populate("products.product");

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: [],
            });
        }

        return res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to retrieve cart, Try again Later",
        });
    }
};

module.exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const qty = Number(quantity);

        if (!qty || qty < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        let cart = await cartModel.findOne({
            user: req.user._id,
        });

        if (!cart) {
            cart = new cartModel({
                user: req.user._id,
                products: [],
            });
        }

        const existingProduct = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += qty;
        } else {
            cart.products.push({
                product: productId,
                quantity: qty,
            });
        }

        await cart.save();

        await cart.populate("products.product");

        return res.status(200).json({
            message: "Product added to cart successfully",
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to add product to cart, Try again Later",
        });
    }
};

module.exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const qty = Number(quantity);

        if (!qty || qty < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        }

        const cart = await cartModel.findOne({
            user: req.user._id,
        });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        const itemIndex = cart.products.findIndex(
            (item) => item._id.toString() === req.params.id
        );
        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Cart item not found",
            });
        }
        cart.products[itemIndex].quantity = qty;
        await cart.save();

        await cart.populate("products.product");

        return res.status(200).json({
            message: "Cart item updated successfully",
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to update cart item, Try again Later",
        });
    }
};

module.exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await cartModel.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        const itemIndex = cart.products.findIndex(
            (item) => item._id.toString() === req.params.id
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Cart item not found",
            });
        }

        cart.products.splice(itemIndex, 1);
        await cart.save();

        await cart.populate("products.product");

        return res.status(200).json({
            message: "Cart item removed successfully",
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to remove item from cart, Try again Later",
        });
    }
};

module.exports.clearCart = async (req, res, next) => {
    try {
        const cart = await cartModel.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        cart.products = [];
        await cart.save();

        await cart.populate("products.product");

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to clear cart",
        });
    }
};