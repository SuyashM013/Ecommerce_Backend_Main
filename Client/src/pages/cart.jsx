import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Cart() {
    const navigate = useNavigate()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updatingItems, setUpdatingItems] = useState(new Set())

    // Fetch cart on component mount
    useEffect(() => {
        fetchCart()
    }, [])

    // Fetch cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/signin')
                return
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCart(response.data.cart?.products || [])
            setError(null)
        } catch (err) {
            console.error('Error fetching cart:', err)
            if (err.response?.status === 401) {
                navigate('/signin')
            } else {
                setError('Failed to load cart. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Update item quantity
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return

        try {
            setUpdatingItems(prev => new Set(prev).add(itemId))
            const token = localStorage.getItem('token')

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/update/${itemId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            // Update local state
            setCart(prevCart =>
                prevCart.map(item =>
                    item._id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            )
        } catch (err) {
            console.error('Error updating quantity:', err)
            setError('Failed to update quantity. Please try again.')
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev)
                newSet.delete(itemId)
                return newSet
            })
        }
    }

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            setUpdatingItems(prev => new Set(prev).add(itemId))
            const token = localStorage.getItem('token')

            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/remove/${itemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            // Update local state
            setCart(prevCart => prevCart.filter(item => item._id !== itemId))
        } catch (err) {
            console.error('Error removing item:', err)
            setError('Failed to remove item. Please try again.')
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev)
                newSet.delete(itemId)
                return newSet
            })
        }
    }

    // Clear entire cart
    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your entire cart?')) {
            return
        }

        try {
            const token = localStorage.getItem('token')

            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/clear`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCart([])
        } catch (err) {
            console.error('Error clearing cart:', err)
            setError('Failed to clear cart. Please try again.')
        }
    }

    // Calculate totals
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity
        }, 0)
    }

    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0
    const total = subtotal + tax + shipping

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-slate-950 text-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin"></div>
                        <p className="text-cyan-300">Loading your cart...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)] pointer-events-none" />
            <div className="absolute left-10 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />

            <Navbar />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
                    <p className="mt-2 text-slate-400">
                        {cart.length === 0 ? 'Your cart is empty' : `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        {error}
                    </div>
                )}

                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-6 text-6xl">🛒</div>
                        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-slate-400 mb-8">
                            Start shopping to add items to your cart
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeFromCart}
                                        isUpdating={updatingItems.has(item._id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary
                                subtotal={subtotal}
                                tax={tax}
                                shipping={shipping}
                                total={total}
                                onCheckout={() => navigate('/checkout')}
                                onContinueShopping={() => navigate('/')}
                                onClearCart={clearCart}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Cart Item Component
function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }) {
    const product = item.product || {}
    const image = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/150'

    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur hover:border-cyan-300/30 hover:bg-white/10 transition-all">
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-800">
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                    <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{product.category}</p>
                    <p className="text-cyan-400 font-semibold">
                        ${(product.price || 0).toFixed(2)}
                    </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                    <button
                        onClick={() => onRemove(item._id)}
                        disabled={isUpdating}
                        className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50 transition-colors"
                    >
                        Remove
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                        >
                            −
                        </button>
                        <span className="w-8 text-center font-semibold">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <div className="font-semibold">
                        ${((product.price || 0) * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Order Summary Component
function OrderSummary({ subtotal, tax, shipping, total, onCheckout, onContinueShopping, onClearCart }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur sticky top-20">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
            </div>

            <div className="mb-6 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-cyan-400">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onCheckout}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 py-3 font-semibold text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                    Proceed to Checkout
                </button>
                <button
                    onClick={onContinueShopping}
                    className="w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-3 font-semibold text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-400/20 transition-all"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={onClearCart}
                    className="w-full text-sm text-red-400 hover:text-red-300 py-2 transition-colors"
                >
                    Clear Cart
                </button>
            </div>

            {/* Promo Code */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <label className="block text-sm font-medium mb-2">Apply Promo Code</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 border border-white/10 focus:border-cyan-400/50 focus:outline-none transition-colors"
                    />
                    <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart