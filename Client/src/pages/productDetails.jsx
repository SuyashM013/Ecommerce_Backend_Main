import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

function ProductDetails() {
    const location = useLocation()
    const product = location.state?.product ?? {}

    const images = useMemo(() => {
        return Array.isArray(product.images) && product.images.length > 0 ? product.images : []
    }, [product.images])

    const [activeImage, setActiveImage] = useState(images[0] ?? '')

    const ratingValue = typeof product.ratingsAverage === 'number' ? product.ratingsAverage.toFixed(1) : '0.0'

    return (
        <main className='relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]' />
            <div className='absolute left-8 top-8 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl' />
            <div className='absolute bottom-8 right-8 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl' />

            <section className='relative mx-auto max-w-7xl'>
                <div className='mb-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-2xl'>
                    <div>
                        <p className='text-xs font-medium uppercase tracking-[0.24em] text-cyan-100'>Product details</p>
                        <h1 className='mt-1 text-lg font-semibold text-white sm:text-xl'>Premium shopping experience</h1>
                    </div>
                    <div className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200'>
                        {product.category || 'Uncategorized'}
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
                    <div className='overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-6'>
                        <div className='flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-cyan-400/20 to-fuchsia-500/20'>
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.name || 'Product image'}
                                    className='h-105 w-full object-cover sm:h-130'
                                />
                            ) : (
                                <div className='flex h-105 w-full items-center justify-center sm:h-130'>
                                    <p className='text-sm tracking-[0.2em] text-slate-300 uppercase'>No image available</p>
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className='mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6'>
                                {images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type='button'
                                        onClick={() => setActiveImage(image)}
                                        className={`overflow-hidden rounded-2xl border p-1 transition ${
                                            activeImage === image
                                                ? 'border-cyan-300/70 bg-cyan-300/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name || 'Product'} thumbnail ${index + 1}`}
                                            className='h-20 w-full rounded-xl object-cover'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-8'>
                        <div className='flex flex-wrap items-center gap-3'>
                            <span className='rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100'>
                                {product.category || 'Category'}
                            </span>
                            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300'>
                                {ratingValue} rating
                            </span>
                        </div>

                        <h2 className='mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
                            {product.name || 'Product name'}
                        </h2>

                        <div className='mt-5 flex items-end justify-between gap-4 border-b border-white/10 pb-5'>
                            <div>
                                <p className='text-sm uppercase tracking-[0.24em] text-slate-400'>Price</p>
                                <p className='mt-2 text-4xl font-semibold text-cyan-300'>
                                    ${product.price ?? '0.00'}
                                </p>
                            </div>

                            <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right'>
                                <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Average rating</p>
                                <p className='mt-1 text-xl font-semibold text-white'>{ratingValue} / 5</p>
                            </div>
                        </div>

                        <div className='mt-6 space-y-4'>
                            <div>
                                <p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-400'>Description</p>
                                <p className='mt-3 leading-7 text-slate-300'>
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                                <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                                    <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Category</p>
                                    <p className='mt-2 text-lg font-medium text-white'>{product.category || 'N/A'}</p>
                                </div>
                                <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                                    <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Rating</p>
                                    <p className='mt-2 text-lg font-medium text-white'>{ratingValue}</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                            <button className='rounded-2xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-5 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110'>
                                Add to Cart
                            </button>
                            <button className='rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10'>
                                Save for later
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ProductDetails