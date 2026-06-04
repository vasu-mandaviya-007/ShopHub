// import React, { useEffect } from 'react';
// import './NewCollections.css';
// import Item from '../Item/Item';
// import { useState } from 'react';
// import api_paths from '../../config/apis';
// import Loader from '../Loader/Loader';

// const NewCollections = () => {

//      const [newcollection, setnewcollection] = useState([]);
//      const [loading, setloading] = useState(true);
//      // const [iserror, setiserror] = useState(false);

//      const fetchproduct = async () => {

//           try {

//                await fetch(api_paths.newcollections)
//                     .then((response) => response.json())
//                     .then((data) => setnewcollection(data));

//           }
//           catch (error) {

//                console.error(error)
//                // setiserror(true);

//           }
//           finally {

//                // setTimeout(() => {
//                //      setloading(false);
//                // }, 300)
//                setloading(false);

//           }
//      }

//      useEffect(() => {

//           fetchproduct();

//      }, []);

//      if (loading) {
//           return <Loader />
//      }

//      return (
//           <div className='newcollections'>
//                <h1>NEW COLLECTIONS</h1>
//                <hr />
//                <div className="collections">
//                     {newcollection.map((item, i) => {
//                          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
//                     })}
//                </div>
//           </div>
//      );
// }



// export default NewCollections;



import React, { useEffect, useState, useRef, useCallback } from 'react';
import Item from './Item';
import api_paths from '../config/apis';

/* ─────────────────────────────────────────────
   Your MongoDB Product schema's category field
   stores lowercase values like: "women", "men", "kid"
   Map them to display labels here.
───────────────────────────────────────────── */
const FILTERS = [
     { label: 'All', value: 'all' },
     { label: 'Women', value: 'womens' },
     { label: 'Men', value: 'mens' },
     { label: 'Kids', value: 'kids' },
];

/* ── Skeleton card ── */
const SkeletonCard = () => (
     <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
          <div className="aspect-3/4 bg-zinc-200" />
          <div className="p-3 flex flex-col gap-2">
               <div className="h-3 bg-zinc-200 rounded w-3/4" />
               <div className="h-3 bg-zinc-200 rounded w-1/2" />
          </div>
     </div>
);

const NewCollections = () => {
     const [allProducts, setAllProducts] = useState([]);   // full dataset (up to 40)
     const [displayed, setDisplayed] = useState([]);   // after client-side filter
     const [loading, setLoading] = useState(true);
     const [isError, setIsError] = useState(false);
     const [activeFilter, setActiveFilter] = useState('all');
     const [filterLoading, setFilterLoading] = useState(false);
     const [visible, setVisible] = useState(false);
     const sectionRef = useRef(null);

     /* ── Fetch all new products on mount ── */
     const fetchProducts = useCallback(async () => {
          setLoading(true);
          setIsError(false);
          try {
               const res = await fetch(api_paths.newcollections);   // no ?category — fetch all
               const data = await res.json();
               setAllProducts(data);
               setDisplayed(data);                                    // start with "All"
          } catch (err) {
               console.error(err);
               setIsError(true);
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => { fetchProducts(); }, [fetchProducts]);

     /* ── Client-side filter whenever activeFilter changes ── */
     useEffect(() => {
          if (loading) return;

          setFilterLoading(true);

          // Small async tick so the skeleton flashes in (feels snappy, not sluggish)
          const t = setTimeout(() => {
               const filtered =
                    activeFilter === 'all'
                         ? allProducts
                         : allProducts.filter(
                              (p) => p.category?.toLowerCase() === activeFilter
                         );
               setDisplayed(filtered);
               setFilterLoading(false);
          }, 180);

          return () => clearTimeout(t);
     }, [activeFilter, allProducts, loading]);

     /* ── Scroll-triggered section entrance ── */
     useEffect(() => {
          const observer = new IntersectionObserver(
               ([entry]) => { if (entry.isIntersecting) setVisible(true); },
               { threshold: 0.1 }
          );
          if (sectionRef.current) observer.observe(sectionRef.current);
          return () => observer.disconnect();
     }, []);

     const showSkeleton = loading || filterLoading;

     return (
          <section
               ref={sectionRef}
               className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24"
          >
               {/* ── Section header ── */}
               <div
                    className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10
          transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
               >
                    <div>
                         <div className="flex items-center gap-3 mb-3">
                              <span className="h-px w-10 bg-rose-400" />
                              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-rose-500">
                                   Just Dropped
                              </span>
                         </div>
                         <h2
                              className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                         >
                              New Collections
                         </h2>
                         <p className="mt-2 text-zinc-400 text-sm max-w-sm leading-relaxed">
                              Fresh styles added every week — be the first to wear what's next.
                         </p>
                    </div>

                    {/* Live count badge — updates with filter */}
                    {!loading && !isError && (
                         <div className="flex items-center gap-2 shrink-0">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-sm text-zinc-400 font-medium transition-all duration-300">
                                   {filterLoading ? '—' : `${displayed.length} style${displayed.length !== 1 ? 's' : ''}`}
                              </span>
                         </div>
                    )}
               </div>

               {/* ── Filter tabs ── */}
               {!loading && !isError && (
                    <div
                         className={`flex gap-2 flex-wrap mb-10 transition-all duration-700 delay-100
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                         {FILTERS.map(({ label, value }) => (
                              <button
                                   key={value}
                                   onClick={() => setActiveFilter(value)}
                                   className={`relative px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200
                ${activeFilter === value
                                             ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-800/20'
                                             : 'text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-700 bg-white'
                                        }`}
                              >
                                   {label}
                                   {/* Count pill per category */}
                                   {!filterLoading && value !== 'all' && (
                                        <span
                                             className={`ml-1.5 inline-flex items-center justify-center text-[9px] font-bold rounded-full px-1.5 py-0.5
                    ${activeFilter === value ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                                        >
                                             {allProducts.filter((p) => p.category?.toLowerCase() === value).length}
                                        </span>
                                   )}
                              </button>
                         ))}
                    </div>
               )}

               {/* ── Error state ── */}
               {isError && (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-2xl">
                              <i className="fa-solid fa-circle-exclamation" />
                         </div>
                         <p className="text-zinc-500 text-sm">Couldn't load collections. Please try again.</p>
                         <button
                              onClick={fetchProducts}
                              className="px-5 py-2 text-xs font-semibold tracking-widest uppercase border border-zinc-300 rounded-full hover:border-rose-400 hover:text-rose-500 transition-colors duration-200"
                         >
                              Retry
                         </button>
                    </div>
               )}

               {/* ── Product grid ── */}
               {!isError && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                         {showSkeleton
                              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                              : displayed.map((item, i) => (
                                   <div
                                        key={item.id ?? item._id ?? i}
                                        className="opacity-0 animate-[fadeUp_0.45s_ease-out_forwards]"
                                        style={{ animationDelay: `${i * 45}ms` }}
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

               {/* ── Empty state (category has no items) ── */}
               {!showSkeleton && !isError && displayed.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 text-2xl">
                              <i className="fa-solid fa-shirt" />
                         </div>
                         <p className="text-zinc-400 text-sm">
                              No new{' '}
                              <span className="font-semibold text-zinc-600">
                                   {FILTERS.find((f) => f.value === activeFilter)?.label}
                              </span>{' '}
                              collections yet — check back soon!
                         </p>
                         <button
                              onClick={() => setActiveFilter('all')}
                              className="text-xs text-rose-500 font-semibold hover:underline"
                         >
                              ← Show all
                         </button>
                    </div>
               )}

               {/* ── View all CTA ── */}
               {!showSkeleton && !isError && displayed.length > 0 && (
                    <div
                         className={`flex flex-col sm:flex-row items-center justify-between gap-6 mt-14 pt-10
            border-t border-zinc-100 transition-all duration-700 delay-300
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                         <p className="text-zinc-400 text-sm text-center sm:text-left">
                              Want early access?{' '}
                              <span className="text-rose-500 font-semibold cursor-pointer hover:underline">
                                   Join our drop list →
                              </span>
                         </p>
                         <button className="group flex items-center gap-3 px-8 py-3.5 border border-zinc-800 rounded-full text-sm font-semibold tracking-wide text-zinc-800 hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 active:scale-95 shrink-0">
                              View All Collections
                              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-200" />
                         </button>
                    </div>
               )}

          </section>
     );
};

export default NewCollections;