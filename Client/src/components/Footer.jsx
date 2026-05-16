import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-200 relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:justify-between gap-8">
                    <div className="md:w-1/3">
                        <h3 className="text-2xl font-semibold mb-3">ShopEasy</h3>
                        <p className="text-sm text-gray-400">
                            Trusted marketplace for millions of products. Fast delivery,
                            secure payments and easy returns — everything you expect from
                            a modern ecommerce store.
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mt-4 inline-block hover:bg-blue-700 bg-blue-500 text-sm py-2 px-3 rounded"
                        >
                            Back to top
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:w-2/3">
                        <div>
                            <h4 className="font-medium mb-2">Customer Care</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>Help Center</li>
                                <li>Returns</li>
                                <li>Track Order</li>
                                <li>Shipping Info</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">About</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>About Us</li>
                                <li>Careers</li>
                                <li>Press</li>
                                <li>Blog</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Policy</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>Terms of Use</li>
                                <li>Privacy Policy</li>
                                <li>Security</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Payment & App</h4>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>Payments</li>
                                <li>Gift Cards</li>
                                <li>
                                    <div className="flex gap-2 mt-2">
                                        <a className="inline-block bg-white/5 hover:bg-white/10 px-3 py-2 rounded text-xs">App Store</a>
                                        <a className="inline-block bg-white/5 hover:bg-white/10 px-3 py-2 rounded text-xs">Google Play</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-sm text-gray-400">© {new Date().getFullYear()} ShopEasy — All Rights Reserved</div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-400">Language</div>
                        <select className="bg-gray-800 text-sm text-gray-200 py-1 px-2 rounded">
                            <option>English</option>
                            <option>हिन्दी</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer