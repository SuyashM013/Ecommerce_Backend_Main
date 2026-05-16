import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function AddToCartButton({ productId, className = '', variant = 'primary' }) {
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/signin')
            return
        }

        try {
            setLoading(true)
            await addToCart(productId, 1)
            setMessage('Added to cart!')
            setTimeout(() => setMessage(''), 2000)
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add to cart')
            setTimeout(() => setMessage(''), 2000)
        } finally {
            setLoading(false)
        }
    }

    const baseStyle = 'rounded-lg px-4 py-2.5 font-semibold transition-all disabled:opacity-50 flex items-center gap-2 justify-center'

    const variantStyles = {
        primary: 'w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30',
        secondary: 'w-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-400/20',
        small: 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/30 text-sm',
    }

    return (
        <div>
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className={`${baseStyle} ${variantStyles[variant]} ${className}`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                        Adding...
                    </>
                ) : (
                    <>
                        🛒
                        Add to Cart
                    </>
                )}
            </button>
            {message && (
                <p className={`text-xs mt-2 text-center ${message.includes('Added') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default AddToCartButton
