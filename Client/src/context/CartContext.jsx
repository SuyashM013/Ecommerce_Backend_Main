import React, { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [cartLoading, setCartLoading] = useState(false)
    const [cartError, setCartError] = useState(null)

    // Fetch cart from server
    const fetchCart = useCallback(async () => {
        try {
            setCartLoading(true)
            const token = localStorage.getItem('token')

            if (!token) {
                setCartItems([])
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

            setCartItems(response.data.cart?.products || [])
            setCartError(null)
        } catch (err) {
            console.error('Error fetching cart:', err)
            setCartError(err.message)
        } finally {
            setCartLoading(false)
        }
    }, [])

    // Add product to cart
    const addToCart = useCallback(async (productId, quantity = 1) => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('Please login to add items to cart')
            }

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/add`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCartItems(response.data.cart?.products || [])
            setCartError(null)
            return response.data
        } catch (err) {
            console.error('Error adding to cart:', err)
            setCartError(err.response?.data?.message || err.message)
            throw err
        }
    }, [])

    // Update item quantity
    const updateQuantity = useCallback(async (itemId, quantity) => {
        try {
            const token = localStorage.getItem('token')

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/update/${itemId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCartItems(response.data.cart?.products || [])
            setCartError(null)
        } catch (err) {
            console.error('Error updating quantity:', err)
            setCartError(err.message)
            throw err
        }
    }, [])

    // Remove item from cart
    const removeFromCart = useCallback(async (itemId) => {
        try {
            const token = localStorage.getItem('token')

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/carts/remove/${itemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCartItems(response.data.cart?.products || [])
            setCartError(null)
        } catch (err) {
            console.error('Error removing from cart:', err)
            setCartError(err.message)
            throw err
        }
    }, [])

    // Clear cart
    const clearCart = useCallback(async () => {
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

            setCartItems([])
            setCartError(null)
        } catch (err) {
            console.error('Error clearing cart:', err)
            setCartError(err.message)
            throw err
        }
    }, [])

    // Calculate totals
    const calculateTotals = useCallback(() => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity
        }, 0)

        const tax = subtotal * 0.1
        const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0
        const total = subtotal + tax + shipping

        return {
            subtotal,
            tax,
            shipping,
            total,
            itemCount: cartItems.length,
        }
    }, [cartItems])

    const value = {
        cartItems,
        cartLoading,
        cartError,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateTotals,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
