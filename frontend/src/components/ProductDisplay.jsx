// import React, { useContext } from 'react';
// import './ProductDisplay.css'
// import { ShopContext } from '../../context/ShopContext';

// const ProductDisplay = (props) => {
//      const {product} = props;

//      const { addToCart } = useContext(ShopContext);

//      return (
//           <div className='productdisplay'>
//                <div className="productdisplay-left">
//                     <div className="productdisplay-img-list">
//                          <img src={product.image} alt="" />
//                          <img src={product.image} alt="" />
//                          <img src={product.image} alt="" />
//                          <img src={product.image} alt="" />
//                     </div>
//                     <div className="productdisplay-img">
//                          <img className='productdisplay-main-img' src={product.image} alt="" />
//                     </div>
//                </div>
//                <div className="productdisplay-right">
//                     <h1>{product.name}</h1>
//                     <div className="productdisplay-right-stars">
//                          <i className="fa-solid fa-star"></i>
//                          <i className="fa-solid fa-star"></i>
//                          <i className="fa-solid fa-star"></i>
//                          <i className="fa-solid fa-star"></i>
//                          <i className="fa-solid fa-star-half"></i>
//                          <p>(122)</p>
//                     </div>
//                     <div className="productdisplay-right-prices">
//                          <div className="productdisplay-right-price-old">${product.old_price}</div>
//                          <div className="productdisplay-right-price-new">${product.new_price}</div>
//                     </div>
//                     <div className="productdisplay-right-description">
//                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus atque similique ea. Asperiores placeat animi voluptatum est ab a delectus expedita sapiente cupiditate natus?
//                     </div>
//                     <div className="productdisplay-right-size">
//                          <h1>Select Size</h1>
//                          <div className="productdisplay-right-sizes">
//                               <div>S</div>
//                               <div>M</div>
//                               <div>L</div>
//                               <div>XL</div>
//                               <div>XXL</div>
//                          </div>
//                     </div>
//                     <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
//                     <p className='productdisplay-right-category'><span>Category : </span>Women, T-Shirt , Crop Top</p>
//                     <p className='productdisplay-right-category'><span>Tags : </span>Modern, Latest</p>
//                </div>
//           </div>
//      );
// }

// export default ProductDisplay;



import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const Stars = ({ rating = 4.5, count = 122 }) => {
     const full = Math.floor(rating);
     const half = rating % 1 >= 0.5;
     const empty = 5 - full - (half ? 1 : 0);
     return (
          <div className="flex items-center gap-1.5">
               {Array.from({ length: full }).map((_, i) => <i key={`f${i}`} className="fa-solid fa-star text-amber-400 text-sm" />)}
               {half && <i className="fa-solid fa-star-half-stroke text-amber-400 text-sm" />}
               {Array.from({ length: empty }).map((_, i) => <i key={`e${i}`} className="fa-regular fa-star text-zinc-300 text-sm" />)}
               <span className="text-zinc-400 text-xs ml-1">({count} reviews)</span>
          </div>
     );
};

const ProductDisplay = ({ product }) => {
     const { addToCart } = useContext(ShopContext);
     const [selectedSize, setSelectedSize] = useState(null);
     const [activeImg, setActiveImg] = useState(product.image);
     const [added, setAdded] = useState(false);
     const [qty, setQty] = useState(1);

     const discount = Math.floor(100 - (product.new_price * 100) / product.old_price);

     const handleAddToCart = () => {
          addToCart(product.id);
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
     };

     return (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-10">
               <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                    {/* ── LEFT: images ── */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:w-120 xl:w-135 shrink-0">
                         {/* Thumbnails */}
                         <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
                              {[product.image, product.image, product.image, product.image].map((img, i) => (
                                   <button
                                        key={i}
                                        onClick={() => setActiveImg(img)}
                                        className={`w-16 h-20 sm:w-18 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0
                  ${activeImg === img ? 'border-zinc-900 shadow-md' : 'border-transparent hover:border-zinc-300'}`}
                                   >
                                        <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                                   </button>
                              ))}
                         </div>

                         {/* Main image */}
                         <div className="flex-1 order-1 sm:order-2 rounded-2xl overflow-hidden bg-[#f5f3f0] aspect-3/4 relative group">
                              <img
                                   src={activeImg}
                                   alt={product.name}
                                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              {discount > 0 && (
                                   <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                                        -{discount}%
                                   </span>
                              )}
                         </div>
                    </div>

                    {/* ── RIGHT: info ── */}
                    <div className="flex-1 flex flex-col">

                         {/* Category badge */}
                         <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-rose-500 mb-2">
                              {product.category}
                         </span>

                         {/* Name */}
                         <h1
                              className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight mb-3"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                         >
                              {product.name}
                         </h1>

                         {/* Stars */}
                         <div className="mb-5">
                              <Stars rating={4.5} count={122} />
                         </div>

                         {/* Prices */}
                         <div className="flex items-baseline gap-3 mb-6">
                              <span className="text-3xl font-black text-zinc-900">
                                   ₹{product.new_price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-lg text-zinc-400 line-through font-medium">
                                   ₹{product.old_price.toLocaleString('en-IN')}
                              </span>
                              {discount > 0 && (
                                   <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                        {discount}% off
                                   </span>
                              )}
                         </div>

                         {/* Description */}
                         <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-lg">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus atque similique ea.
                              Asperiores placeat animi voluptatum est ab a delectus expedita sapiente cupiditate natus.
                         </p>

                         {/* Size picker */}
                         <div className="mb-6">
                              <div className="flex items-center justify-between mb-3">
                                   <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
                                        Select Size
                                   </h3>
                                   <button className="text-xs text-rose-500 font-semibold hover:underline">
                                        Size Guide →
                                   </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                   {SIZES.map((size) => (
                                        <button
                                             key={size}
                                             onClick={() => setSelectedSize(size)}
                                             className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all duration-200
                    ${selectedSize === size
                                                       ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-105'
                                                       : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                                                  }`}
                                        >
                                             {size}
                                        </button>
                                   ))}
                              </div>
                              {!selectedSize && (
                                   <p className="text-[11px] text-zinc-400 mt-2">Please select a size</p>
                              )}
                         </div>

                         {/* Qty + Add to cart */}
                         <div className="flex flex-wrap items-center gap-3 mb-8">
                              {/* Qty stepper */}
                              <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                                   <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-sm"
                                   >
                                        <i className="fa-solid fa-minus" />
                                   </button>
                                   <span className="px-4 py-3 text-sm font-bold text-zinc-800 min-w-10 text-center">
                                        {qty}
                                   </span>
                                   <button
                                        onClick={() => setQty(q => q + 1)}
                                        className="px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-sm"
                                   >
                                        <i className="fa-solid fa-plus" />
                                   </button>
                              </div>

                              {/* Add to cart */}
                              <button
                                   onClick={handleAddToCart}
                                   className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 active:scale-95
                ${added
                                             ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                             : 'bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.03]'
                                        }`}
                              >
                                   {added ? (
                                        <><i className="fa-solid fa-check" /> Added!</>
                                   ) : (
                                        <><i className="fa-solid fa-bag-shopping" /> Add to Cart</>
                                   )}
                              </button>

                              {/* Wishlist */}
                              <button className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:border-rose-300 hover:text-rose-500 transition-all duration-200">
                                   <i className="fa-regular fa-heart" />
                              </button>
                         </div>

                         {/* Divider */}
                         <div className="border-t border-zinc-100 pt-6 flex flex-col gap-2">
                              <p className="text-xs text-zinc-400">
                                   <span className="font-semibold text-zinc-600">Category: </span>
                                   <span className="capitalize">{product.category}</span>
                              </p>
                              <p className="text-xs text-zinc-400">
                                   <span className="font-semibold text-zinc-600">Tags: </span>
                                   Modern, Latest, Trending
                              </p>
                         </div>

                         {/* Trust badges */}
                         <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-zinc-100">
                              {[
                                   { icon: 'fa-truck-fast', text: 'Free Delivery' },
                                   { icon: 'fa-rotate-left', text: 'Easy Returns' },
                                   { icon: 'fa-shield-halved', text: 'Secure Payment' },
                              ].map(({ icon, text }) => (
                                   <div key={text} className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                        <i className={`fa-solid ${icon} text-zinc-400`} />
                                        {text}
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>

          </section>
     );
};

export default ProductDisplay;