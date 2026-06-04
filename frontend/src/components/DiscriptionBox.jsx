// import React from 'react';
// import './DiscriptionBox.css'

// const DiscriptionBox = () => {
//      return (
//           <div className='discriptionbox'>
//                <div className="discriptionbox-navigator">
//                     <div className="discriptionbox-nav-box">Description</div>
//                     <div className="discriptionbox-nav-box fade">Reviews (122)</div>
//                </div>
//                <div className="discriptionbox-discription">
//                     <p>
//                          An e-commerce website is a digital platform that enables individuals or businesses to buy and sell products or services over the internet. These websites serve as online storefronts where users can browse products, compare prices, make purchases, and manage their orders from the comfort of their homes or offices.
//                     </p>
//                     <p>
//                          Displays the products or services with details like descriptions, prices, images, and reviews. Allows users to search for specific items and filter them by categories, price, ratings, etc.
//                     </p>
//                </div>
//           </div>
//      );
// }

// export default DiscriptionBox;


import React, { useState } from 'react';

const TABS = [
     { id: 'description', label: 'Description' },
     { id: 'reviews', label: 'Reviews', badge: 122 },
     { id: 'shipping', label: 'Shipping & Returns' },
];

const DiscriptionBox = () => {
     const [activeTab, setActiveTab] = useState('description');

     return (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-14">

               {/* ── Tab bar ── */}
               <div className="flex border-b border-zinc-200 gap-0">
                    {TABS.map(({ id, label, badge }) => (
                         <button
                              key={id}
                              onClick={() => setActiveTab(id)}
                              className={`relative px-5 sm:px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap
                                   ${activeTab === id
                                        ? 'text-zinc-900 border-b-2 border-zinc-900 -mb-px'
                                        : 'text-zinc-400 hover:text-zinc-600'
                                   }
                              `}
                         >
                              {label}
                              {badge && (
                                   <span className={`ml-1.5 inline-flex items-center justify-center text-[10px] font-bold rounded-full px-1.5 py-0.5
                                        ${activeTab === id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                                   >
                                        {badge}
                                   </span>
                              )}
                         </button>
                    ))}
               </div>

               {/* ── Tab content ── */}
               <div className="mt-8 max-w-3xl">

                    {activeTab === 'description' && (
                         <div className="flex flex-col gap-5 text-zinc-500 text-sm leading-relaxed animate-[fadeUp_0.3s_ease-out]">
                              <p>
                                   An e-commerce website is a digital platform that enables individuals or businesses to buy and
                                   sell products or services over the internet. These websites serve as online storefronts where
                                   users can browse products, compare prices, make purchases, and manage their orders from the
                                   comfort of their homes or offices.
                              </p>
                              <p>
                                   Displays the products or services with details like descriptions, prices, images, and reviews.
                                   Allows users to search for specific items and filter them by categories, price, ratings, and more.
                              </p>
                              {/* Feature bullets */}
                              <ul className="mt-2 flex flex-col gap-2">
                                   {[
                                        'Premium quality fabric — 100% breathable cotton',
                                        'Machine washable, colour-fast guarantee',
                                        'Available in 5 sizes: S, M, L, XL, XXL',
                                        'Model is 5\'8" and wearing size M',
                                   ].map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-zinc-500">
                                             <i className="fa-solid fa-check text-emerald-500 text-xs mt-0.5 shrink-0" />
                                             {f}
                                        </li>
                                   ))}
                              </ul>
                         </div>
                    )}

                    {activeTab === 'reviews' && (
                         <div className="flex flex-col gap-6 animate-[fadeUp_0.3s_ease-out]">
                              {/* Summary */}
                              <div className="flex items-center gap-8 pb-6 border-b border-zinc-100">
                                   <div className="flex flex-col items-center">
                                        <span className="text-5xl font-black text-zinc-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>4.5</span>
                                        <div className="flex gap-0.5 mt-1">
                                             {[1, 2, 3, 4].map(i => <i key={i} className="fa-solid fa-star text-amber-400 text-xs" />)}
                                             <i className="fa-solid fa-star-half-stroke text-amber-400 text-xs" />
                                        </div>
                                        <span className="text-zinc-400 text-xs mt-1">122 reviews</span>
                                   </div>
                                   {/* Bar chart */}
                                   <div className="flex-1 flex flex-col gap-1.5">
                                        {[['5★', 68], ['4★', 22], ['3★', 7], ['2★', 2], ['1★', 1]].map(([label, pct]) => (
                                             <div key={label} className="flex items-center gap-2 text-xs text-zinc-400">
                                                  <span className="w-6 text-right">{label}</span>
                                                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                       <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                                  </div>
                                                  <span className="w-6">{pct}%</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                              <p className="text-zinc-400 text-sm">Detailed reviews coming soon.</p>
                         </div>
                    )}

                    {activeTab === 'shipping' && (
                         <div className="flex flex-col gap-5 text-sm text-zinc-500 leading-relaxed animate-[fadeUp_0.3s_ease-out]">
                              {[
                                   { icon: 'fa-truck-fast', title: 'Standard Delivery', body: 'Free on orders above ₹499. Delivered in 3–5 business days.' },
                                   { icon: 'fa-bolt', title: 'Express Delivery', body: '₹99 flat. Delivered within 1–2 business days.' },
                                   { icon: 'fa-rotate-left', title: 'Easy Returns', body: '15-day hassle-free return policy. No questions asked.' },
                              ].map(({ icon, title, body }) => (
                                   <div key={title} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                                             <i className={`fa-solid ${icon} text-sm`} />
                                        </div>
                                        <div>
                                             <p className="font-semibold text-zinc-700 mb-0.5">{title}</p>
                                             <p>{body}</p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

          </section>
     );
};

export default DiscriptionBox;