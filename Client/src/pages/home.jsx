import React from 'react'
const { useState, useEffect } = React
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [product, setProduct] = React.useState([])
    const navigate = useNavigate()

    
    const getProducts = async () => {
        try{
            const response = await axios.get('https://ecommerce-backend-main-1.onrender.com/api/users/products', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.data
            console.log(data) // ----------------------------------------
            setProduct(data.products)
            
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }
    
    useEffect(() => {
        getProducts()
    }, [])

    return (
        <main className='relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-10 text-white'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]' />
            <div className='absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl' />
            <div className='absolute bottom-10 right-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl' />

            <section className='relative mx-auto max-w-7xl'>
                <div className='mb-12 text-center'>
                    <span className='inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100'>
                        Shop our collection
                    </span>
                    <h1 className='mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
                        Welcome to our E-commerce Store!
                    </h1>
                    <p className='mt-4 text-lg leading-6 text-slate-300'>
                        Discover a wide range of products at unbeatable prices. Shop now and enjoy exclusive deals!
                    </p>
                </div>

                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {product.map((item) => (
                        <div
                            key={item._id}
                            onClick={()=> navigate(`/product-details`, { state: { product: item } })}
                            className='cursor-pointer group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/15 backdrop-blur-2xl'
                        >
                            <div className='mb-4 h-40 w-full rounded-lg bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20 flex items-center justify-center'>
                                <img src={item.images[ 0 ]} alt={item.name} className='w-full h-full object-cover rounded-md' />
                                {/* <p className='text-slate-400 text-sm'>Product Image</p> */}
                            </div>
                            <h2 className='text-lg font-semibold text-white mb-2'>{item.name}</h2>
                            <p className='text-cyan-300 font-semibold mb-2'>${item.price}</p>
                            <p className='text-sm text-slate-300 mb-2 line-clamp-2'>{item.description}</p>
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
            </section>
        </main>
    )
}

export default Home