// import React, { useEffect } from 'react';
// import './Popular.css';
// import Item from '../Item/Item';
// import { useState } from 'react';
// import api_paths from '../../config/apis';
// import Loader from '../Loader/Loader';

// const Popular = () => {

//      const [popular, setpopular] = useState([]);
//      const [loading, setloading] = useState(true);
//      const [iserror, setiserror] = useState(false);

//      const fetchproduct = async () => {

//           try {

//                await fetch(api_paths.popularinwomen)
//                     .then((response) => response.json())
//                     .then((data) => setpopular(data));

//           }
//           catch (error) {

//                console.error(error)
//                setiserror(true);

//           }
//           finally {

//                setTimeout(() => {
//                     setloading(false);
//                }, 300)

//           }
//      }

//      useEffect(() => {

//           fetchproduct();

//      }, []);

//      if (loading) {
//           return;
//      }


//      return (
//           <>
//                {
//                     loading ? (
//                          <Loader />
//                     ) : iserror ? (
//                          <h1>error</h1>
//                     ) : (

//                          <div className='popular'>
//                               <h1>POPULAR IN WOMEN</h1>
//                               <hr />
//                               <div className="popular-item">
//                                    {popular.map((item, i) => {
//                                         return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
//                                    })}
//                               </div>
//                          </div>

//                     )
//                }
//           </>
//      );
// }

// export default Popular;


import React, { useEffect, useState } from 'react';
import Item from './Item';
import api_paths from '../config/apis';

/* ── Skeleton card placeholder ── */
const SkeletonCard = () => (
     <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
          <div className="aspect-3/4 bg-zinc-200" />
          <div className="p-3 flex flex-col gap-2">
               <div className="h-3 bg-zinc-200 rounded w-3/4" />
               <div className="h-3 bg-zinc-200 rounded w-1/2" />
          </div>
     </div>
);

const Popular = () => {
     const [popular, setPopular] = useState([]);
     const [loading, setLoading] = useState(true);
     const [isError, setIsError] = useState(false);

     useEffect(() => {
          const fetchProducts = async () => {
               try {
                    const res = await fetch(api_paths.popularinwomen);
                    const data = await res.json();
                    setPopular(data);
               } catch (err) {
                    console.error(err);
                    setIsError(true);
               } finally {
                    setTimeout(() => setLoading(false), 300);
               }
          };
          fetchProducts();
     }, []);

     return (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">

               {/* ── Section header ── */}
               <div className="flex flex-col items-center text-center mb-12">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-4">
                         <span className="h-px w-10 bg-rose-400" />
                         <span className="text-xs font-semibold tracking-[0.25em] uppercase text-rose-500">
                              Trending Now
                         </span>
                         <span className="h-px w-10 bg-rose-400" />
                    </div>

                    {/* Main title */}
                    <h2
                         className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight"
                         style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                         Popular in Women
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                         Hand-picked favourites loved by thousands of shoppers this season.
                    </p>
               </div>

               {/* ── Error state ── */}
               {isError && (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-2xl">
                              <i className="fa-solid fa-circle-exclamation" />
                         </div>
                         <p className="text-zinc-500 text-sm">
                              Couldn't load products. Please try again later.
                         </p>
                         <button
                              onClick={() => { setIsError(false); setLoading(true); }}
                              className="px-5 py-2 text-xs font-semibold tracking-widest uppercase border border-zinc-300 rounded-full hover:border-rose-400 hover:text-rose-500 transition-colors duration-200"
                         >
                              Retry
                         </button>
                    </div>
               )}

               {/* ── Grid: Skeletons while loading, Items when done ── */}
               {!isError && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                         {loading
                              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                              : popular.map((item, i) => (
                                   <div
                                        key={item.id ?? i}
                                        className="opacity-0 animate-[fadeUp_0.5s_ease-out_forwards]"
                                        style={{ animationDelay: `${i * 60}ms` }}
                                   >
                                        <Item
                                             id={item.id}
                                             name={item.name}
                                             image={item.image}
                                             new_price={item.new_price}
                                             old_price={item.old_price}
                                        />
                                   </div>
                              ))}
                    </div>
               )}

               {/* ── View all CTA ── */}
               {!loading && !isError && popular.length > 0 && (
                    <div className="flex justify-center mt-14">
                         <button className="group flex items-center gap-3 px-8 py-3.5 border border-zinc-800 rounded-full text-sm font-semibold tracking-wide text-zinc-800 hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 active:scale-95">
                              View All Women's
                              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-200" />
                         </button>
                    </div>
               )}

          </section>
     );
};

export default Popular;