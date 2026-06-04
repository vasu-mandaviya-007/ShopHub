// import React from 'react';
// import './Hero.css';
// import hand_iocn from '../image/hand_icon.png'
// import hero_image from '../image/hero_image.png'

// const Hero = () => {
//      return (
//           <div className='hero'>

//                <div className="hero-left">
//                     <h2>NEW ARRIVALS ONLY</h2>
//                     <div>
//                          <div className="hero-hand-icon"> 
//                               <p>new</p>
//                               <img src={hand_iocn} alt="" />
//                          </div>
//                          <p>collections</p>
//                          <p>for everyone</p>
//                     </div>
//                     <div className="hero-latest-btn">
//                          <div>Letest Collection</div>
//                          <i className="fa-solid fa-arrow-right"></i>
//                     </div>

//                </div>

//                <div className="hero-right">
//                     <img src={hero_image} alt="" />
//                </div>
//           </div>
//      );
// }

// export default Hero;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hand_icon from '../assets/hand_icon.png';
import hero_image from '../assets/hero_image.png';

const Hero = () => {
     const [visible, setVisible] = useState(false);

     useEffect(() => {
          // Trigger staggered entrance after mount
          const t = setTimeout(() => setVisible(true), 80);
          return () => clearTimeout(t);
     }, []);

     return (
          <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#faf7f4]">

               {/* ── Decorative background blobs ── */}
               <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Warm amber blob top-left */}
                    <div className="absolute -top-32 -left-32 w-120 h-120 rounded-full bg-blue-200/40 blur-[100px]" />
                    {/* Rose blob bottom-right */}
                    <div className="absolute bottom-0 right-0 w-120 h-120 rounded-full bg-cyan-100/30 blur-[120px]" />
                    {/* Tiny coral circle accent */}
                    <div className="absolute top-1/3 left-1/2 w-120 h-120 rounded-full bg-pink-100/60 blur-[80px]" />
               </div>

               {/* ── Vertical ticker (left edge, desktop only) ── */}
               <div className="hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 flex-col items-center gap-3">

                    <div className="w-px h-16 bg-zinc-300" />
                    <span className="text-[10px] [writing-mode:vertical-rl] tracking-[0.3em]  text-zinc-400 rotate-180 font-medium uppercase">
                         SS · 2025
                    </span>
                    <div className="w-px h-16 bg-zinc-300" />

               </div>

               {/* ── Main content grid ── */}
               <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center py-16 lg:py-0">

                    {/* ── LEFT ── */}
                    <div className="flex flex-col justify-center">

                         {/* Eyebrow tag */}
                         <div className={`inline-flex items-center gap-2 mb-6 transition-all duration-700 delay-[0ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >

                              <span className="w-6 h-px bg-rose-400" />
                              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-rose-500">
                                   New Arrivals Only
                              </span>

                         </div>

                         {/* Headline */}
                         <div className="overflow-hidden mb-1">
                              <h1 className={`font-black leading-[0.9] font-serif tracking-tight text-[#1a1a1a] transition-all duration-700 delay-100 text-[clamp(3rem,8vw,3.5rem)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                   New
                              </h1>
                         </div>

                         {/* "collections" with hand icon */}
                         <div className={`flex items-center gap-4 mb-1 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                              <h1 className="font-black leading-[0.9] tracking-tight text-[#1a1a1a] font-serif text-[clamp(3rem,8vw,3.5rem)]">
                                   Collections
                              </h1>
                              <img
                                   src={hand_icon}
                                   alt="hand wave"
                                   className="w-12 sm:w-16 lg:w-20 -mt-2 drop-shadow-md animate-[wave_2s_ease-in-out_infinite]"
                              />
                         </div>

                         <div className="overflow-hidden mb-8">
                              <h1 className={`font-black leading-[0.9] [-webkit-text-stroke:2px_#1a1a1a] text-transparent font-serif tracking-tight transition-all duration-700 delay-300 text-[clamp(3rem,8vw,3.5rem)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} >
                                   For Everyone
                              </h1>
                         </div>

                         {/* Sub-copy */}
                         <p className={`text-zinc-500 text-base sm:text-lg max-w-sm leading-relaxed mb-10 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                              Discover curated fashion for men, women & kids — crafted for every moment of your life.
                         </p>

                         {/* CTA row */}
                         <div
                              className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                   }`}
                         >
                              {/* Primary CTA */}
                              <Link to="/collection">
                                   <button className="group relative flex items-center gap-3 px-7 py-4 bg-[#1a1a1a] text-white text-sm font-semibold tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-800/30 hover:scale-[1.03] active:scale-95">
                                        {/* Animated shimmer on hover */}
                                        <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                                        <span className="relative">Latest Collection</span>
                                        <span className="relative flex items-center justify-center w-7 h-7 bg-white/15 rounded-full group-hover:bg-rose-500 transition-colors duration-300">
                                             <i className="fa-solid fa-arrow-right text-xs" />
                                        </span>
                                   </button>
                              </Link>

                              {/* Secondary ghost link */}
                              <Link
                                   to="/sale"
                                   className="text-sm font-medium text-zinc-500 underline underline-offset-4 decoration-zinc-300 hover:text-rose-500 hover:decoration-rose-400 transition-colors duration-200"
                              >
                                   View Sale →
                              </Link>
                         </div>

                         {/* Stats row */}
                         <div
                              className={`flex gap-8 mt-12 pt-8 border-t border-zinc-200 transition-all duration-700 delay-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                   }`}
                         >
                              {[
                                   { value: '2K+', label: 'Products' },
                                   { value: '50K+', label: 'Happy Customers' },
                                   { value: '4.9★', label: 'Avg Rating' },
                              ].map(({ value, label }) => (
                                   <div key={label}>
                                        <p className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                             {value}
                                        </p>
                                        <p className="text-xs text-zinc-400 tracking-wide">{label}</p>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* ── RIGHT — Hero image ── */}
                    <div
                         className={`relative flex items-center justify-center transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                              }`}
                    >
                         {/* Decorative ring behind image */}
                         <div className="absolute w-85 h-85 sm:w-110 sm:h-110 lg:w-130 lg:h-130 rounded-full border border-zinc-200/80" />
                         <div className="absolute w-70 h-70 sm:w-90 sm:h-90 lg:w-107.5 lg:h-107.5 rounded-full bg-linear-to-br from-amber-100/60 to-rose-100/60" />

                         {/* Floating badge */}
                         <div className="absolute top-6 right-6 sm:right-10 lg:right-0 lg:top-12 bg-white/90 backdrop-blur-sm border border-zinc-100 shadow-xl rounded-2xl px-4 py-3 animate-[float_3s_ease-in-out_infinite]">
                              <p className="text-[10px] font-semibold tracking-widest uppercase text-rose-500 mb-0.5">New Drop</p>
                              <p className="text-sm font-bold text-zinc-800">Summer '25</p>
                         </div>

                         {/* Discount badge */}
                         <div className="absolute bottom-10 left-4 sm:left-10 lg:left-2 bg-[#1a1a1a] text-white shadow-xl rounded-2xl px-4 py-3 animate-[float_3s_ease-in-out_infinite_1.5s]">
                              <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-0.5">Up to</p>
                              <p className="text-lg font-black">40% OFF</p>
                         </div>

                         {/* Hero image */}
                         <img
                              src={hero_image}
                              alt="Hero fashion model"
                              className="relative z-10 w-65 sm:w-85 lg:w-105 xl:w-120 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
                         />
                    </div>
               </div>

          </section>
     );
};

export default Hero;