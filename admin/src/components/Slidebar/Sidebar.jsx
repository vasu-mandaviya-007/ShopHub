import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../image/cartIcon.png';
import list_product_icon from '../../image/product_list_icon.png';
import right_angle_icon from '../../image/right_angle.png'
import left_angle_icon from '../../image/left_angle.png'
import { useState } from 'react';

const Slidebar = () => {

     const [isSidebarExpand, setisSidebarExpand] = useState(true);

     const ToggleMenu = (e) => {
          setisSidebarExpand(!isSidebarExpand)
     }

     return (

          <div className={`sidebar ${isSidebarExpand ? '' : 'active'}`}>

               <img src={isSidebarExpand ? left_angle_icon : right_angle_icon} onClick={ToggleMenu} className='menu_btn' alt="" />

               <Link to={'/addproduct'} style={{ textDecoration: 'none' }}  >
                    <div className="sidebar-item">
                         <img src={add_product_icon} alt="" />
                         <p>Add Product</p>
                    </div>
               </Link>

               <Link to={'/listproduct'} style={{ textDecoration: 'none' }}  >
                    <div className="sidebar-item">
                         <img src={list_product_icon} alt="" />
                         <p>Product List</p>
                    </div>
               </Link>

          </div>

     );
}

export default Slidebar;
