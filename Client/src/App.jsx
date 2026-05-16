import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/signup'
import Signin from './pages/signin'
import Home from './pages/home'
import ProductDetails from './pages/productDetails'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Cart from './pages/cart'

function App() {


  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* <Navbar />   */}

        <div className="grow">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/product-details' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>


  )
}

export default App
