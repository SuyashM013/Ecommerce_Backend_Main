import React from 'react'
import axios from 'axios'
const { useState, useEffect } = React
import { useNavigate } from 'react-router-dom'
import { use } from 'react';



function products() {

    const [product, setProduct] = useState([]);
    const navigate = useNavigate()

    const getProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/`

            )
            const data = await response.data
            // console.log(data) // ----------------------------------------
            setProduct(data.products)

        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    // Electronics & Gadgets
    // Fashion & Apparel
    // Beauty & Personal Care
    // Home & Kitchen
    // Health & Fitness

    const electronics = product.filter(
        item => item.category === "electronics & gadgets"
    );

    const fashion = product.filter(
        item => item.category === "fashion & apparel"
    );

    const beauty = product.filter(
        item => item.category === "beauty & personal care"
    );

    const home = product.filter(
        item => item.category === "home & kitchen"
    );

    const health = product.filter(
        item => item.category === "health & fitness"
    );



    useEffect(() => {
        getProducts()
    }, [])
    return (

        <div className=' flex gap-5 flex-col'>

            <div className='flex flex-col gap-5'>

                <h1 className='text-4xl font-bold text-white block'>Electronics</h1>

                <div className='overflow-x-auto scrollbar-hide'>

                    <div className='flex gap-6 min-w-screen'>

                        {electronics.map((item) => (

                            <div
                                key={item._id}
                                onClick={() =>
                                    navigate(`/product-details`, {
                                        state: { product: item }
                                    })
                                }
                                className='w-72 shrink-0 cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                            >

                                <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold text-white mb-2'>
                                    {item.name}
                                </h2>

                                <p className='text-cyan-300 font-semibold mb-2'>
                                    ${item.price}
                                </p>

                                <p className='text-sm text-slate-300 mb-2 line-clamp-2'>
                                    {item.description}
                                </p>

                                <div className='mb-4 flex justify-between text-xs text-slate-400'>
                                    <span>Stock: {item.stock}</span>
                                    <span>{item.category}</span>
                                </div>

                                <button className='w-full rounded-xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

            </div>


            <div className='flex flex-col gap-5'>

                <h1 className='text-4xl font-bold text-white block'>Fashion</h1>

                <div className='overflow-x-auto scrollbar-hide'>

                    <div className='flex gap-6 min-w-max'>

                        {fashion.map((item) => (

                            <div
                                key={item._id}
                                onClick={() =>
                                    navigate(`/product-details`, {
                                        state: { product: item }
                                    })
                                }
                                className='w-72 shrink-0 cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                            >

                                <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold text-white mb-2'>
                                    {item.name}
                                </h2>

                                <p className='text-cyan-300 font-semibold mb-2'>
                                    ${item.price}
                                </p>

                                <p className='text-sm text-slate-300 mb-2 line-clamp-2'>
                                    {item.description}
                                </p>

                                <div className='mb-4 flex justify-between text-xs text-slate-400'>
                                    <span>Stock: {item.stock}</span>
                                    <span>{item.category}</span>
                                </div>

                                <button className='w-full rounded-xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

            </div>


            <div className='flex flex-col gap-5'>

                <h1 className='text-4xl font-bold text-white block'>Beauty</h1>

                <div className='overflow-x-auto scrollbar-hide'>

                    <div className='flex gap-6 min-w-max'>

                        {beauty.map((item) => (

                            <div
                                key={item._id}
                                onClick={() =>
                                    navigate(`/product-details`, {
                                        state: { product: item }
                                    })
                                }
                                className='w-72 shrink-0 cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                            >

                                <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold text-white mb-2'>
                                    {item.name}
                                </h2>

                                <p className='text-cyan-300 font-semibold mb-2'>
                                    ${item.price}
                                </p>

                                <p className='text-sm text-slate-300 mb-2 line-clamp-2'>
                                    {item.description}
                                </p>

                                <div className='mb-4 flex justify-between text-xs text-slate-400'>
                                    <span>Stock: {item.stock}</span>
                                    <span>{item.category}</span>
                                </div>

                                <button className='w-full rounded-xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

            </div>

            <div className='flex flex-col gap-5'>

                <h1 className='text-4xl font-bold text-white block'>Home</h1>

                <div className='overflow-x-auto scrollbar-hide'>

                    <div className='flex gap-6 min-w-max'>

                        {home.map((item) => (

                            <div
                                key={item._id}
                                onClick={() =>
                                    navigate(`/product-details`, {
                                        state: { product: item }
                                    })
                                }
                                className='w-72 shrink-0 cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                            >

                                <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold text-white mb-2'>
                                    {item.name}
                                </h2>

                                <p className='text-cyan-300 font-semibold mb-2'>
                                    ${item.price}
                                </p>

                                <p className='text-sm text-slate-300 mb-2 line-clamp-2'>
                                    {item.description}
                                </p>

                                <div className='mb-4 flex justify-between text-xs text-slate-400'>
                                    <span>Stock: {item.stock}</span>
                                    <span>{item.category}</span>
                                </div>

                                <button className='w-full rounded-xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

            </div>


            <div className='flex flex-col gap-5'>

                <h1 className='text-4xl font-bold text-white block'>Health</h1>

                <div className='overflow-x-auto scrollbar-hide'>

                    <div className='flex gap-6 min-w-max'>

                        {health.map((item) => (

                            <div
                                key={item._id}
                                onClick={() =>
                                    navigate(`/product-details`, {
                                        state: { product: item }
                                    })
                                }
                                className='w-72 shrink-0 cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                            >

                                <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold text-white mb-2'>
                                    {item.name}
                                </h2>

                                <p className='text-cyan-300 font-semibold mb-2'>
                                    ${item.price}
                                </p>

                                <p className='text-sm text-slate-300 mb-2 line-clamp-2'>
                                    {item.description}
                                </p>

                                <div className='mb-4 flex justify-between text-xs text-slate-400'>
                                    <span>Stock: {item.stock}</span>
                                    <span>{item.category}</span>
                                </div>

                                <button className='w-full rounded-xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

            </div>





        </div >
    )
}

export default products