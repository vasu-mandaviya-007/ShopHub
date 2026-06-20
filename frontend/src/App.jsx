import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Footer from './components/Footer'; 


import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ForgetPass from './components/Auth/ForgetPass';
import OtpVerification from './components/Auth/OtpVerification';
import UpdatePass from './components/Auth/UpdatePass';


import Account from './pages/Account';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Import Banners
import men_banner from './assets/mens_banner.png'
import women_banner from './assets/women_banner.png'
import kids_banner from './assets/kids_banner.jpg'
import AddressBook from './pages/AddressBook';



function App() {

    return (
        <>
            <Router>

                <Navbar />

                <Routes>

                    <Route path='/' element={<Shop />} />
                    <Route path='/mens' element={<ShopCategory banner={men_banner} category="mens" />} />
                    <Route path='/womens' element={<ShopCategory banner={women_banner} category="womens" />} />
                    <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kids" />} />
                    <Route path='/product' element={<Product />}>
                        <Route path=':productId' element={<Product />} />
                    </Route>
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/forgetPass' element={<ForgetPass />} />

                    {/* <Route element={<Super />}> */}
                    <Route path='/verify' element={<OtpVerification />} />
                    <Route path='/updatepass' element={<UpdatePass />} />
                    {/* </Route> */}

                    <Route path='/checkout' element={<Checkout />} />
                    <Route path='/order-success' element={<OrderSuccess />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/address" element={<AddressBook />} />

                </Routes>
                <Footer />
            </Router>
        </>
    )
}

export default App

