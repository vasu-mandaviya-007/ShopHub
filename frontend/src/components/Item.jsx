// import React from 'react';
// import './Item.css';
// import { Link } from 'react-router-dom'; 


// const Item = (props) => {
//      return (
//           <div className='item'>
//                <Link to={`/product/${props.id}`}> <img onClick={() => window.scrollTo(0,0)} className='item-image' src={props.image} alt="" /></Link>
//                <p>{props.name}</p>  
//                <div className='item-prices'> 
//                     <div className="item-price-new">
//                          ₹{props.new_price}
//                     </div>
//                     <div className="item-price-old">
//                          ₹{props.old_price}
//                     </div>
//                     <div className="discount">
//                          { Math.floor(100 - (props.new_price * 100) / props.old_price)}% off
//                     </div>
//                </div>
//           </div>
//      );
// }

// export default Item;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Item = ({ id, name, image, new_price, old_price }) => {
     const [imgLoaded, setImgLoaded] = useState(false);
     const discount = Math.floor(100 - (new_price * 100) / old_price);

     return (
          <Link
               to={`/product/${id}`}
               onClick={() => window.scrollTo(0, 0)}
               className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer"
          >
               {/* ── Image container ── */}
               <div className="relative overflow-hidden bg-[#f5f3f0] aspect-3/4">
                    {/* Skeleton shimmer while loading */}
                    {!imgLoaded && (
                         <div className="absolute inset-0 bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-100 animate-pulse" />
                    )}

                    <img
                         src={image}
                         alt={name}
                         onLoad={() => setImgLoaded(true)}
                         className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                    />

                    {/* Discount badge */}
                    {discount > 0 && (
                         <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                              -{discount}%
                         </div>
                    )}

                    {/* Quick-action overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out bg-linear-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
                         <p className="text-white text-xs font-semibold tracking-widest uppercase text-center opacity-90">
                              View Product →
                         </p>
                    </div>
               </div>

               {/* ── Info ── */}
               <div className="px-3 pt-3 pb-4 flex flex-col gap-1">
                    {/* Name */}
                    <p className="text-[13px] font-dm font-medium text-zinc-700 leading-snug line-clamp-2" >
                         {name}
                    </p>

                    {/* Prices */}
                    <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                         <span className="text-[15px] font-bold text-zinc-900">
                              ₹{new_price?.toLocaleString('en-IN')}
                         </span>
                         <span className="text-[12px] text-zinc-400 line-through">
                              ₹{old_price?.toLocaleString('en-IN')}
                         </span>
                         <span className="text-[11px] font-semibold text-emerald-600 ml-auto">
                              {discount}% off
                         </span>
                    </div>

                    {/* Thin accent line that grows on hover */}
                    <div className="mt-2 h-px w-0 group-hover:w-full bg-rose-400 transition-all duration-500 rounded-full" />
               </div>
          </Link>
     );
};

export default Item;