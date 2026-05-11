import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Navbar({ user = null, cartCount = 0 }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [fetchedUser, setFetchedUser] = useState(null)
    const [isUserLoading, setIsUserLoading] = useState(false)
    const profileModalRef = useRef(null)
    const effectiveUser = user || fetchedUser
    const isLoggedIn = Boolean(effectiveUser)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            setFetchedUser(null)
            return
        }

        const fetchUserProfile = async () => {
            try {
                setIsUserLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setFetchedUser(response.data.user)
            } catch (error) {
                console.error('Error fetching user profile:', error)
                localStorage.removeItem('token')
                setFetchedUser(null)
            } finally {
                setIsUserLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    // Close profile modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        console.log('Searching for:', searchQuery)
        // Implement search functionality
    }

    const handleLogout = () => {
        setIsProfileOpen(false)
        setFetchedUser(null)
        localStorage.removeItem('token')
        // Implement logout functionality
        console.log('Logging out...')
    }

    const handleAuthNavigation = () => {
        setIsMobileMenuOpen(false)
        setIsProfileOpen(false)
    }

    return (
        <nav className="bg-linear-to-r bg-blue-400/20 shadow-lg sticky top-0 z-40 backdrop-blur-lg rounded-lg mb-10">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">E</span>
                        </div>
                        <span className="text-white font-bold text-xl hidden sm:inline">EShop</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 max-w-md">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">

                        {/* Categories Dropdown */}
                        <div className="hidden lg:block relative group">
                            <button className="text-white font-semibold hover:text-yellow-400 transition-colors py-2 px-3 flex items-center space-x-1">
                                <span>Categories</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-t-lg">Electronics</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Clothing</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Home & Garden</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Books</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-b-lg">Sports</a>
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <Link to="#" className="relative text-white hover:text-yellow-400 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <div className="relative" ref={profileModalRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors focus:outline-none"
                                >
                                    <span className="hidden sm:inline text-sm font-medium">{effectiveUser.name}</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl transform transition-all duration-200 z-50 overflow-hidden">
                                        <div className="bg-linear-to-r from-blue-600 to-blue-800 px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-bold text-lg truncate">{effectiveUser.name}</h3>
                                                    <p className="text-blue-100 text-sm truncate">{effectiveUser.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Phone</p>
                                                    <p className="text-gray-800 font-medium wrap-break-word">{effectiveUser.phone || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Member Since</p>
                                                    <p className="text-gray-800 font-medium">{effectiveUser.joinDate || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Total Orders</p>
                                                    <p className="text-blue-600 font-bold text-lg">{effectiveUser.orders ?? 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Total Spent</p>
                                                    <p className="text-blue-600 font-bold text-lg">{effectiveUser.totalSpent || '$0.00'}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Address</p>
                                                <p className="text-gray-800 wrap-break-word">{effectiveUser.address || 'Not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 space-y-2">
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                                Edit Profile
                                            </button>
                                            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                                                View Orders
                                            </button>
                                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                                                Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/signin"
                                    onClick={handleAuthNavigation}
                                    className="px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white hover:text-blue-700 transition-colors font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={handleAuthNavigation}
                                    className="px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-white hover:text-yellow-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                        <a href="#" className="block text-white hover:text-yellow-400 py-2 px-3 rounded-lg transition-colors">Electronics</a>
                        <a href="#" className="block text-white hover:text-yellow-400 py-2 px-3 rounded-lg transition-colors">Clothing</a>
                        <a href="#" className="block text-white hover:text-yellow-400 py-2 px-3 rounded-lg transition-colors">Home & Garden</a>
                        <a href="#" className="block text-white hover:text-yellow-400 py-2 px-3 rounded-lg transition-colors">Books</a>

                        {!isLoggedIn && (
                            <div className="pt-3 flex gap-3">
                                <Link
                                    to="/signin"
                                    onClick={handleAuthNavigation}
                                    className="flex-1 text-center px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white hover:text-blue-700 transition-colors font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={handleAuthNavigation}
                                    className="flex-1 text-center px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="pt-3 border-t border-white/20 text-white">
                                <p className="font-semibold">{effectiveUser.name}</p>
                                <p className="text-sm text-blue-100">{effectiveUser.email}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar