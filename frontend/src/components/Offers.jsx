// import React from 'react';
// import './Offers.css';

// const Offers = () => {
//      return (
//           <div className='offers'>
//                <div className="offers-left">
//                     <h1>Exclusive</h1>
//                     <h1>Offers For You</h1>
//                     <p>ONLY ON BEST SELLERS PRODUCTS</p>
//                     <button>Check Noew</button>
//                </div>
//                <div className="offers-right">
//                     <img src="" alt="" />
//                </div>
//           </div>
//      );
// }

// export default Offers;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/* Animated countdown to build urgency */
const useCountdown = (targetHours = 23, targetMins = 59, targetSecs = 59) => {
     const [time, setTime] = useState({ h: targetHours, m: targetMins, s: targetSecs });
     useEffect(() => {
          const interval = setInterval(() => {
               setTime((prev) => {
                    let { h, m, s } = prev;
                    if (s > 0) return { h, m, s: s - 1 };
                    if (m > 0) return { h, m: m - 1, s: 59 };
                    if (h > 0) return { h: h - 1, m: 59, s: 59 };
                    return { h: 0, m: 0, s: 0 };
               });
          }, 1000);
          return () => clearInterval(interval);
     }, []);
     return time;
};

const Pad = ({ n }) => (
     <span className="font-black tabular-nums">{String(n).padStart(2, '0')}</span>
);

const Offers = () => {
     const [visible, setVisible] = useState(false);
     const { h, m, s } = useCountdown(11, 43, 27);

     useEffect(() => {
          const t = setTimeout(() => setVisible(true), 80);
          return () => clearTimeout(t);
     }, []);

     return (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">

               <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] min-h-85 flex items-stretch">

                    {/* ── Decorative background elements ── */}
                    <div className="pointer-events-none absolute inset-0">
                         {/* Large rose glow bottom-left */}
                         <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-rose-600/25 blur-[90px]" />
                         {/* Amber glow top-right */}
                         <div className="absolute -top-16 right-1/3 w-64 h-64 rounded-full bg-amber-400/15 blur-[80px]" />
                         {/* Subtle grid pattern overlay */}
                         <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-size-[40px_40px]" />
                    </div>

                    {/* ── Left content ── */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 lg:py-16">

                         {/* Eyebrow */}
                         <div className={`flex items-center gap-2 mb-5 transition-all duration-700 delay-[0ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                   Limited Time Deal
                              </span>
                         </div>

                         {/* Headline */}
                         <h2 className={`leading-none font-serif font-black tracking-tight text-white mb-4 transition-all duration-700 delay-100 text-[clamp(2.2rem,5vw,3.5rem)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                              Exclusive Offers

                              <br />

                              <span className='text-transparent text-[clamp(2.2rem,5vw,3rem)] [-webkit-text-stroke:2px_rgba(251,191,36,0.7)]' >
                                   For You
                              </span>

                         </h2>

                         {/* Sub-copy */}
                         <p className={`text-zinc-400 text-sm sm:text-base font-medium tracking-wide mb-6 max-w-xs transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >
                              Only on best-seller products — don't miss out on today's handpicked deals.
                         </p>

                         {/* Countdown timer */}
                         <div className={`flex items-center gap-2 mb-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >

                              <span className="text-zinc-500 text-xs tracking-widest uppercase mr-1">Ends in</span>
                              {[
                                   { val: h, label: 'hr' },
                                   { val: m, label: 'min' },
                                   { val: s, label: 'sec' },
                              ].map(({ val, label }, i) => (

                                   <React.Fragment key={label}>

                                        <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-13">
                                             <span className="text-white text-lg font-black tabular-nums leading-none">
                                                  {String(val).padStart(2, '0')}
                                             </span>
                                             <span className="text-zinc-500 text-[9px] tracking-widest uppercase mt-0.5">{label}</span>
                                        </div>

                                        {i < 2 && <span className="text-zinc-500 font-bold text-lg">:</span>}

                                   </React.Fragment>
                              ))}

                         </div>

                         {/* CTA */}
                         <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >

                              <Link to="/sale">
                                   <button className="group relative flex items-center gap-3 px-7 py-3.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-full overflow-hidden hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.04] transition-all duration-300 active:scale-95">
                                        <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                                        <span className="relative">Check Now</span>
                                        <i className="fa-solid fa-arrow-right text-xs relative group-hover:translate-x-1 transition-transform duration-200" />
                                   </button>
                              </Link>

                              <Link to="/womens">
                                   <button className="px-6 py-3.5 text-sm font-semibold text-zinc-300 border border-zinc-700 rounded-full hover:border-zinc-400 hover:text-white transition-all duration-200">
                                        Browse All
                                   </button>
                              </Link>

                         </div>

                         {/* Discount chips row */}
                         <div className={`flex flex-wrap gap-2 mt-8 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} >

                              {['Up to 40% OFF', 'Free Shipping', 'Easy Returns'].map((chip) => (
                                   <span key={chip} className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 border border-zinc-700 rounded-full px-3 py-1" >
                                        {chip}
                                   </span>
                              ))}

                         </div>

                    </div>

                    {/* ── Right — decorative visual ── */}
                    <div className="relative hidden lg:flex flex-1 items-center justify-center pr-10">
                         {/* Outer ring */}
                         <div className="absolute w-72 h-72 rounded-full border border-white/5" />
                         {/* Inner glow ring */}
                         <div className="absolute w-52 h-52 rounded-full bg-linear-to-br from-blue-500/20 to-amber-400/10 blur-sm" />

                         {/* Big discount number */}
                         <div className="relative flex flex-col items-center justify-center text-center z-10">
                              <p className="font-serif font-black leading-none text-transparent text-[clamp(5rem,10vw,9rem)] [-webkit-text-stroke:2px_rgba(251,191,36,0.4)] [text-shadow:0_0_80px_rgba(251,191,36,0.15)]" >
                                   40
                              </p>

                              <p className="text-amber-400 font-bold tracking-[0.3em] text-sm uppercase -mt-2" >
                                   % OFF
                              </p>

                              <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">Best Sellers</p>

                         </div>

                         {/* Floating tags */}
                         <div className="absolute top-12 right-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 animate-[float_3s_ease-in-out_infinite]">
                              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Today only</p>
                              <p className="text-white text-sm font-bold">Flash Sale 🔥</p>
                         </div>

                         <div className="absolute bottom-16 right-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 animate-[float_3s_ease-in-out_infinite_1.2s]">
                              <p className="text-[10px] text-emerald-400 uppercase tracking-widest">Shipping</p>
                              <p className="text-white text-sm font-bold">Free 🚚</p>
                         </div>
                    </div>

                    {/* ── Vertical accent line (desktop) ── */}
                    <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
               </div>

          </section>
     );
};

export default Offers;