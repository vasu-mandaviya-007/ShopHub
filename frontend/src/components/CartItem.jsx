
// import React, { useContext } from 'react';
// import './CartItem.css';
// import { ShopContext } from '../../context/ShopContext.jsx';
// import { Link } from 'react-router-dom';
// import Loader from '../Loader/Loader.jsx';

// const CartItem = ({product, cartItem,removeFromCart}) => {

//      return (

//           <div className="cartitems-format cartitems-format-main">
//                <Link to={`/product/${product.id}`}>
//                     <img src={product.image} alt="" className='cartitems-product-icon' />
//                </Link>
//                <p>{product.name}</p>
//                <p>₹{product.new_price}</p>
//                <button className='cartitems-quantity'>{cartItem.quantity}</button>
//                <p>₹{product.new_price * cartItem.quantity}</p>
//                <button onClick={() => removeFromCart(product.id)} className='remove-cart-item fa-solid fa-x' style={{ color: "#f11e48" }}></button>
//           </div>

//      );
// }

// export default CartItem;


import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ product, cartItem, removeFromCart, onQtyChange }) => {
     const lineTotal = product.new_price * cartItem.quantity;

     return (
          <div className="flex items-center gap-4 py-5 border-b border-zinc-100 group">

               {/* Image */}
               <Link to={`/product/${product.id}`} className="shrink-0">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#f5f3f0]">
                         <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         />
                    </div>
               </Link>

               {/* Name + meta */}
               <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`}>
                         <p className="text-sm font-semibold text-zinc-800 leading-snug truncate hover:text-rose-500 transition-colors">
                              {product.name}
                         </p>
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5 capitalize">{product.category}</p>
                    {/* Unit price */}
                    <p className="text-xs text-zinc-500 mt-1">
                         ₹{product.new_price.toLocaleString('en-IN')} × {cartItem.quantity}
                    </p>
               </div>

               {/* Qty stepper */}
               <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden shrink-0">
                    <button
                         onClick={() => onQtyChange(product.id, cartItem.quantity - 1)}
                         className="px-3 py-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 transition-colors text-xs"
                    >
                         <i className="fa-solid fa-minus" />
                    </button>
                    <span className="px-3 py-2 text-sm font-bold text-zinc-800 min-w-8 text-center">
                         {cartItem.quantity}
                    </span>
                    <button
                         onClick={() => onQtyChange(product.id, cartItem.quantity + 1)}
                         className="px-3 py-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 transition-colors text-xs"
                    >
                         <i className="fa-solid fa-plus" />
                    </button>
               </div>

               {/* Line total */}
               <p className="w-24 text-right text-sm font-bold text-zinc-900 shrink-0">
                    ₹{lineTotal.toLocaleString('en-IN')}
               </p>

               {/* Remove */}
               <button
                    onClick={() => removeFromCart(product.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                    aria-label="Remove item"
               >
                    <i className="fa-solid fa-xmark text-sm" />
               </button>
          </div>
     );
};

export default CartItem;