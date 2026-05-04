import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/signup'
import Signin from './pages/signin'
import Home from './pages/home'
import ProductDetails from './pages/productDetails'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/product-details' element={<ProductDetails />} />
      </Routes>
    </Router>


  )
}

export default App
