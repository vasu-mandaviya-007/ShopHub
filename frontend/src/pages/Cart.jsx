// import React, { useContext } from 'react';
// import CartItem from '../components/CartItems/CartItem';

// import '../components/CartItems/CartItem.css';
// import { ShopContext } from '../context/ShopContext.jsx';
// import { Link } from 'react-router-dom';
// import Loader from '../components/Loader/Loader.jsx';


// const Cart = () => {

//      const { RemoveFromCart, isloading, all_product, cartItem } = useContext(ShopContext);

//      if (isloading) {
//           return <Loader />
//      }


//      return (
//           <div className='cartitems'>
//                <div className="cartitems-format-main">
//                     <p>Products</p>
//                     <p>Title</p>
//                     <p>Price</p>
//                     <p>Quantity</p>
//                     <p>Total</p>
//                     <p>Remove</p>
//                </div>
//                <hr />

//                {all_product.map((e, i) => {
//                     const item = cartItem.find(p => Number(p.productId) === e.id);
//                     if (item) {
//                          return (
//                               <CartItem key={i} product={e} cartItem={item} removeFromCart={RemoveFromCart} />
//                          );
//                     }
//                     return null;
//                })}

//                <div className="cartitems-down">
//                     <div className="cartitems-total">
//                          <h1>Cart Total</h1>
//                          <div>
//                               <div className="cartitems-total-item">
//                                    <p>Subtotal</p>
//                               </div>
//                               <hr />
//                               <div className="cartitems-total-item">
//                                    <p>Shipping Fee</p>
//                                    <p>Free</p>
//                               </div>
//                               <hr />
//                               <div className="cartitems-total-item">
//                                    <h3>Total</h3>
//                               </div>
//                          </div>
//                          <button>PROCEED TO CHECKOUT</button>
//                     </div>
//                     <div className="cartitems-promocode">
//                          <p>If you have a promo code, Enter it here</p>
//                          <div className="cartitems-promobox">
//                               <input type="text" placeholder='Promo Code' />
//                               <button>Submit</button>
//                          </div>
//                     </div>
//                </div>
//           </div>
//      );
// }

// export default Cart;


import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import CartItem from '../components/CartItem.jsx';

const SHIPPING_THRESHOLD = 999; // free shipping above this

const Cart = () => {
     const { RemoveFromCart, UpdateCartQuantity, isloading, all_product, cartItem } = useContext(ShopContext);
     const Navigate = useNavigate();

     const [promoCode, setPromoCode] = useState('');
     const [promoApplied, setPromoApplied] = useState(false);
     const [promoError, setPromoError] = useState('');
     const [discount, setDiscount] = useState(0);

     // Build list of items currently in cart
     const cartEntries = all_product
          .map(product => {
               const item = cartItem?.find(p => Number(p.productId) === product.id);
               return item ? { product, cartItem: item } : null;
          })
          .filter(Boolean);

     const subtotal = cartEntries.reduce((sum, { product, cartItem }) => sum + product.new_price * cartItem.quantity, 0);
     const totalItems = cartEntries.reduce((sum, { cartItem }) => sum + cartItem.quantity, 0);
     const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 99;
     const discountAmt = Math.floor(subtotal * discount);
     const total = subtotal - discountAmt + shippingFee;

     const PROMO_CODES = { 'SAVE10': 0.10, 'SAVE20': 0.20, 'SHOPEASE': 0.15 };

     const handlePromo = () => {
          const code = promoCode.trim().toUpperCase();
          if (PROMO_CODES[code]) {
               setDiscount(PROMO_CODES[code]);
               setPromoApplied(true);
               setPromoError('');
          } else {
               setPromoError('Invalid promo code. Try SAVE10 or SAVE20.');
               setPromoApplied(false);
               setDiscount(0);
          }
     };

     const handleQtyChange = (productId, newQty) => {
          if (newQty < 1) {
               RemoveFromCart(productId);
          } else if (UpdateCartQuantity) {
               UpdateCartQuantity(productId, newQty);
          }
     };

     if (isloading) {
          return (
               <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-16 animate-pulse">
                    <div className="h-8 w-32 bg-zinc-200 rounded mb-8" />
                    {Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="flex gap-4 py-5 border-b border-zinc-100">
                              <div className="w-20 h-24 rounded-xl bg-zinc-200 shrink-0" />
                              <div className="flex-1 flex flex-col gap-2">
                                   <div className="h-4 w-1/2 bg-zinc-200 rounded" />
                                   <div className="h-3 w-1/4 bg-zinc-200 rounded" />
                              </div>
                         </div>
                    ))}
               </div>
          );
     }

     /* ── Empty cart ── */
     if (cartEntries.length === 0) {
          return (
               <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-24 flex flex-col items-center text-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 text-3xl">
                         <i className="fa-solid fa-bag-shopping" />
                    </div>
                    <h2 className="text-2xl font-black text-zinc-800" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                         Your cart is empty
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xs">
                         Looks like you haven't added anything yet. Browse our collections to get started.
                    </p>
                    <Link to="/">
                         <button className="mt-2 flex items-center gap-2 px-7 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors">
                              <i className="fa-solid fa-arrow-left text-xs" /> Continue Shopping
                         </button>
                    </Link>
               </div>
          );
     }

     return (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-16">

               {/* ── Page header ── */}
               <div className="flex items-end justify-between mb-8">
                    <div>
                         <h1
                              className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                         >
                              Your Cart
                         </h1>
                         <p className="text-zinc-400 text-sm mt-1">
                              {totalItems} item{totalItems !== 1 ? 's' : ''} in your bag
                         </p>
                    </div>
                    <Link to="/" className="text-xs text-rose-500 font-semibold hover:underline">
                         ← Continue Shopping
                    </Link>
               </div>

               <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* ── LEFT: cart items ── */}
                    <div className="flex-1">

                         {/* Column headers — desktop only */}
                         <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 pb-3 border-b border-zinc-200 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
                              <span className="w-20">Item</span>
                              <span>Description</span>
                              <span className="w-28 text-center">Quantity</span>
                              <span className="w-24 text-right">Total</span>
                              <span className="w-8" />
                         </div>

                         {/* Items */}
                         <div>
                              {cartEntries.map(({ product, cartItem: ci }, i) => (
                                   <CartItem
                                        key={product.id ?? i}
                                        product={product}
                                        cartItem={ci}
                                        removeFromCart={RemoveFromCart}
                                        onQtyChange={handleQtyChange}
                                   />
                              ))}
                         </div>

                         {/* Free shipping progress bar */}
                         {subtotal < SHIPPING_THRESHOLD && (
                              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                   <div className="flex justify-between text-xs font-medium text-amber-700 mb-2">
                                        <span>
                                             Add <span className="font-bold">₹{(SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')}</span> more for free shipping!
                                        </span>
                                        <span>{Math.round((subtotal / SHIPPING_THRESHOLD) * 100)}%</span>
                                   </div>
                                   <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                                        <div
                                             className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                             style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                                        />
                                   </div>
                              </div>
                         )}
                         {subtotal >= SHIPPING_THRESHOLD && (
                              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                                   <i className="fa-solid fa-truck-fast text-emerald-500" />
                                   <p className="text-emerald-700 text-xs font-medium">
                                        You've unlocked <span className="font-bold">free shipping</span> on this order!
                                   </p>
                              </div>
                         )}
                    </div>

                    {/* ── RIGHT: summary ── */}
                    <div className="lg:w-80 xl:w-96 shrink-0">
                         <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sticky top-24">

                              <h2 className="text-lg font-black text-zinc-900 mb-5"
                                   style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                   Order Summary
                              </h2>

                              {/* Line items */}
                              <div className="flex flex-col gap-3 text-sm">
                                   <div className="flex justify-between text-zinc-600">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
                                   </div>

                                   {discountAmt > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                             <span>Promo ({promoCode.toUpperCase()})</span>
                                             <span className="font-semibold">−₹{discountAmt.toLocaleString('en-IN')}</span>
                                        </div>
                                   )}

                                   <div className="flex justify-between text-zinc-600">
                                        <span>Shipping</span>
                                        <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-600' : 'text-zinc-800'}`}>
                                             {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                                        </span>
                                   </div>

                                   <div className="border-t border-zinc-100 pt-3 flex justify-between">
                                        <span className="font-bold text-zinc-900">Total</span>
                                        <span className="font-black text-zinc-900 text-base">₹{total.toLocaleString('en-IN')}</span>
                                   </div>
                              </div>

                              {/* Promo code */}
                              <div className="mt-5">
                                   <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Promo Code</p>
                                   <div className="flex gap-2">
                                        <input
                                             type="text"
                                             value={promoCode}
                                             onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                                             onKeyDown={e => e.key === 'Enter' && handlePromo()}
                                             placeholder="Enter code"
                                             disabled={promoApplied}
                                             className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-700 outline-none focus:border-zinc-400 transition-colors disabled:bg-zinc-50 disabled:text-zinc-400"
                                        />
                                        <button
                                             onClick={handlePromo}
                                             disabled={promoApplied || !promoCode.trim()}
                                             className="px-4 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                             {promoApplied ? <i className="fa-solid fa-check" /> : 'Apply'}
                                        </button>
                                   </div>

                                   {promoApplied && (
                                        <div className="flex items-center justify-between mt-2">
                                             <p className="text-xs text-emerald-600 font-medium">
                                                  <i className="fa-solid fa-tag mr-1" />
                                                  {Math.round(discount * 100)}% discount applied!
                                             </p>
                                             <button
                                                  onClick={() => { setPromoApplied(false); setDiscount(0); setPromoCode(''); }}
                                                  className="text-xs text-zinc-400 hover:text-rose-500 transition-colors"
                                             >
                                                  Remove
                                             </button>
                                        </div>
                                   )}
                                   {promoError && (
                                        <p className="text-xs text-rose-500 mt-1.5">
                                             <i className="fa-solid fa-circle-exclamation mr-1" />{promoError}
                                        </p>
                                   )}
                              </div>

                              {/* Checkout CTA */}
                              <button
                                   onClick={() => Navigate('/checkout')}
                                   className="w-full mt-6 py-4 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                              >
                                   <i className="fa-solid fa-lock text-xs" />
                                   Proceed to Checkout
                                   <span className="ml-1 text-white/80">· ₹{total.toLocaleString('en-IN')}</span>
                              </button>

                              {/* Trust note */}
                              <p className="text-center text-zinc-400 text-[11px] mt-3 flex items-center justify-center gap-1">
                                   <i className="fa-solid fa-shield-halved" /> Secure SSL checkout
                              </p>

                              {/* Payment icons */}
                              <div className="flex justify-center gap-2 mt-4">
                                   {['fa-cc-visa', 'fa-cc-mastercard', 'fa-cc-paypal', 'fa-cc-amex'].map(icon => (
                                        <i key={icon} className={`fa-brands ${icon} text-zinc-300 text-2xl`} />
                                   ))}
                              </div>
                         </div>
                    </div>

               </div>

               <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
      `}</style>
          </div>
     );
};

export default Cart;