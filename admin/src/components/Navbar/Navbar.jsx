import React from 'react';
import './Navbar.css'
import navlogo from '../../image/logo.png'
import profilelogo from '../../image/profileLogo.png'

const Navbar = () => {
     return (
          <div className='navbar'>
               <div className="nav-logo">
                    <img src={navlogo} alt="" />
                    <div className="nav-logo-text">
                         <h1>SHOPPER</h1> 
                         <p>Admin Panel</p>
                    </div>
               </div>
               <img src={profilelogo} className='nav-profile' alt="" />
          </div>
     );
}

export default Navbar;
