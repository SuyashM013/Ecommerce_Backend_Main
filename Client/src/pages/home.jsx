import React from 'react'
const { useState, useEffect } = React
import axios from 'axios'

function home() {
    const [product, setProduct] = React.useState([])

    
    const getProducts = async () => {
        try{
            const response = await axios.get('https://localhost:5500/api/users/products', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.data
            console.log(data)
            setProduct(data.products)
            
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }
    
    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div className='home w-full h-screen flex flex-col items-center justify-center bg-gray-400'>
            <h1 className='text-3xl mb-5'>Welcome to our E-commerce Store!</h1>
            <p className='text-lg mt-2' >Discover a wide range of products at unbeatable prices. Shop now and enjoy exclusive deals!</p>



                <div className='products mt-10 w-full flex items-center justify-center gap-5 flex-wrap'>
                    {product.map((item) => (
                        <div key={item._id} className='product-card w-64 h-80 bg-white rounded-lg shadow-md p-4 flex flex-col items-center'>
                            <img src={item.images[0]} alt={item.name} className='w-full h-40 object-cover rounded-md mb-4' />
                            <h2 className='text-lg font-semibold mb-2'>{item.name}</h2>
                            <p className='text-gray-600 mb-2'>${item.price}</p>
                            <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Add to Cart</button>
                        </div>
                    ))}
                </div>  

        </div>
    )
}

export default home