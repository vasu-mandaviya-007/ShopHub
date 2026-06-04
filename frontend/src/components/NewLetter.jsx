// import React from 'react';
// import './NewLetter.css'

// const NewLetter = () => {
//      return (
//           <div className="newsletter">
//                <h1>Get Exclusive Offers On Your Email</h1>
//                <p>Subscribe to our newletter and stay updated</p>
//                <div>
//                     <input type="email" placeholder='Your Email id' />
//                     <button>Subscribe</button>
//                </div>
//           </div>
//      ); 
// }

// export default NewLetter;


import React, { useState, useEffect, useRef } from 'react';

const NewLetter = () => {
     const [email, setEmail] = useState('');
     const [status, setStatus] = useState('idle'); // idle | loading | success | error
     const [visible, setVisible] = useState(false);
     const sectionRef = useRef(null);

     /* Scroll-triggered entrance */
     useEffect(() => {
          const observer = new IntersectionObserver(
               ([entry]) => { if (entry.isIntersecting) setVisible(true); },
               { threshold: 0.15 }
          );
          if (sectionRef.current) observer.observe(sectionRef.current);
          return () => observer.disconnect();
     }, []);

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!email || !/\S+@\S+\.\S+/.test(email)) {
               setStatus('error');
               setTimeout(() => setStatus('idle'), 2500);
               return;
          }
          setStatus('loading');
          // Replace with your actual API call:
          // await fetch('/api/newsletter', { method:'POST', body: JSON.stringify({ email }) });
          await new Promise((r) => setTimeout(r, 1200)); // simulate network
          setStatus('success');
          setEmail('');
     };

     return (
          <section
               ref={sectionRef}
               className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20 sm:pb-28"
          >
               <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] px-8 sm:px-16 py-16 sm:py-20 flex flex-col items-center text-center">

                    {/* ── Background decorations ── */}
                    <div className="pointer-events-none absolute inset-0">
                         <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-rose-600/20 blur-[90px]" />
                         <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-amber-400/15 blur-[90px]" />
                         {/* Dot-grid */}
                         <div
                              className="absolute inset-0 opacity-[0.035]"
                              style={{
                                   backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                   backgroundSize: '28px 28px',
                              }}
                         />
                    </div>

                    {/* ── Eyebrow ── */}
                    <div
                         className={`flex items-center gap-2 mb-6 transition-all duration-700 delay-[0ms]
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                         <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              Exclusive Access
                         </span>
                    </div>

                    {/* ── Heading ── */}
                    <h2
                         className={`font-black text-white leading-tight tracking-tight mb-3 max-w-xl
            text-[clamp(1.8rem,5vw,3.2rem)] transition-all duration-700 delay-80
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                         style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                         Get Exclusive Offers{' '}
                         <span
                              style={{
                                   WebkitTextStroke: '2px rgba(251,191,36,0.6)',
                                   color: 'transparent',
                              }}
                         >
                              On Your Email
                         </span>
                    </h2>

                    {/* ── Sub-copy ── */}
                    <p
                         className={`text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed mb-10
            transition-all duration-700 delay-160
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                         Subscribe to our newsletter and be the first to know about drops, deals, and style guides.
                    </p>

                    {/* ── Success state ── */}
                    {status === 'success' ? (
                         <div
                              className={`flex flex-col items-center gap-3 transition-all duration-500
              ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                         >
                              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl animate-[pop_0.4s_ease-out]">
                                   <i className="fa-solid fa-check" />
                              </div>
                              <p className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                   You're on the list!
                              </p>
                              <p className="text-zinc-500 text-sm">We'll be in touch with the best offers.</p>
                         </div>
                    ) : (
                         /* ── Input form ── */
                         <form
                              onSubmit={handleSubmit}
                              className={`w-full max-w-md transition-all duration-700 delay-240
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                         >
                              <div
                                   className={`flex items-center bg-white/5 border rounded-full overflow-hidden p-1.5 transition-all duration-300
                ${status === 'error'
                                             ? 'border-rose-500/60 shadow-[0_0_0_3px_rgba(244,63,94,0.15)]'
                                             : 'border-white/10 focus-within:border-white/30 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]'
                                        }`}
                              >
                                   {/* Email icon */}
                                   <span className="pl-4 text-zinc-500 text-sm shrink-0">
                                        <i className="fa-solid fa-envelope" />
                                   </span>

                                   <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                                        placeholder="your@email.com"
                                        className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none"
                                   />

                                   <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold tracking-wide rounded-full hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.03] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                   >
                                        {status === 'loading' ? (
                                             <>
                                                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                  </svg>
                                                  Joining…
                                             </>
                                        ) : (
                                             <>
                                                  Subscribe
                                                  <i className="fa-solid fa-arrow-right text-[10px]" />
                                             </>
                                        )}
                                   </button>
                              </div>

                              {/* Error message */}
                              {status === 'error' && (
                                   <p className="mt-2.5 text-rose-400 text-xs text-center animate-[fadeUp_0.3s_ease-out]">
                                        <i className="fa-solid fa-triangle-exclamation mr-1" />
                                        Please enter a valid email address.
                                   </p>
                              )}

                              <p className="mt-4 text-zinc-600 text-[11px] tracking-wide">
                                   No spam, ever. Unsubscribe anytime. 🔒
                              </p>
                         </form>
                    )} 
 
                    {/* ── Trust bar ── */}
                    <div
                         className={`flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/5 w-full
            transition-all duration-700 delay-320
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                         {[
                              { icon: 'fa-users', stat: '50K+', label: 'Subscribers' },
                              { icon: 'fa-bolt', stat: 'Weekly', label: 'Drop Alerts' },
                              { icon: 'fa-tag', stat: 'Members-only', label: 'Deals' },
                         ].map(({ icon, stat, label }) => (
                              <div key={label} className="flex items-center gap-2 text-zinc-500">
                                   <i className={`fa-solid ${icon} text-xs text-zinc-600`} />
                                   <span className="text-xs font-semibold text-zinc-300">{stat}</span>
                                   <span className="text-xs">{label}</span>
                              </div>
                         ))}
                    </div>
               </div>

          </section>
     );
};

export default NewLetter;