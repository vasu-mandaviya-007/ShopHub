// import React, { useContext } from 'react';
// import './CSS/ShopCategory.css';
// import { ShopContext } from '../context/ShopContext';
// import Item from '../components/Item/Item';

// const ShopCategory = (props) => {
//      const { all_product } = useContext(ShopContext);
//      return (
//           <div className='shopcategory'>
//                <img className='shopcategory-banner' src={props.banner} alt="" />
//                <div className="shopcategory-indexSort">
//                     <p>
//                          <span>Showing 1-12 </span> out of 36 Products
//                     </p>
//                     <div className="shopcategory-sort">
//                          Sort by <i className='fa-solid fa-angle-down'></i>
//                     </div> 
//                </div>
//                <div className="shopcategory-products">
//                     {all_product.map((item, i) => {
//                          if (props.category === item.category) {
//                               return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
//                          }
//                          else {
//                               return null;
//                          }
//                     })}
//                </div>
//                <div className="shopcategory-loadmore">
//                     Explore More
//                </div>
//           </div>
//      );
// }

// export default ShopCategory;



import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/Item';

const SORT_OPTIONS = [
     { label: 'Newest First', value: 'newest' },
     { label: 'Price: Low → High', value: 'price_asc' },
     { label: 'Price: High → Low', value: 'price_desc' },
     { label: 'Most Discount', value: 'discount' },
];

const PAGE_SIZE = 12;

const SkeletonCard = () => (
     <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
          <div className="aspect-3/4 bg-zinc-200" />
          <div className="p-3 flex flex-col gap-2">
               <div className="h-3 bg-zinc-200 rounded w-3/4" />
               <div className="h-3 bg-zinc-200 rounded w-1/2" />
          </div>
     </div>
);

const ShopCategory = ({ banner, category }) => {
     const { all_product } = useContext(ShopContext);

     const [sortBy, setSortBy] = useState('newest');
     const [sortOpen, setSortOpen] = useState(false);
     const [page, setPage] = useState(1);
     const [imgLoaded, setImgLoaded] = useState(false);
     const [visible, setVisible] = useState(false);
     const sortRef = useRef(null);
     const sectionRef = useRef(null);

     /* Close sort dropdown on outside click */
     useEffect(() => {
          const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
          document.addEventListener('mousedown', handler);
          return () => document.removeEventListener('mousedown', handler);
     }, []);

     /* Scroll entrance */
     useEffect(() => {
          const observer = new IntersectionObserver(
               ([e]) => { if (e.isIntersecting) setVisible(true); },
               { threshold: 0.05 }
          );
          if (sectionRef.current) observer.observe(sectionRef.current);
          return () => observer.disconnect();
     }, []);

     /* Reset page when sort changes */
     useEffect(() => { setPage(1); }, [sortBy, category]);

     /* Filter + sort */
     const filtered = useMemo(() => {
          const base = all_product.filter(p => p.category === category);
          return [...base].sort((a, b) => {
               if (sortBy === 'price_asc') return a.new_price - b.new_price;
               if (sortBy === 'price_desc') return b.new_price - a.new_price;
               if (sortBy === 'discount') return (b.old_price - b.new_price) - (a.old_price - a.new_price);
               return b.id - a.id; // newest
          });
     }, [all_product, category, sortBy]);

     const totalCount = filtered.length;
     const shown = filtered.slice(0, page * PAGE_SIZE);
     const hasMore = shown.length < totalCount;
     const start = totalCount === 0 ? 0 : 1;
     const end = shown.length;

     const categoryLabel = category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : 'All';

     return (
          <div ref={sectionRef} className="w-full pt-18 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20">

               {/* ── Banner ── */}
               <div className="relative mt-6 mb-10 rounded-3xl overflow-hidden bg-zinc-100 aspect-21/6 sm:aspect-21/5">
                    {!imgLoaded && (
                         <div className="absolute inset-0 bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-pulse" />
                    )}
                    {banner && (
                         <img
                              src={banner}
                              alt={`${categoryLabel} banner`}
                              onLoad={() => setImgLoaded(true)}
                              className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                         />
                    )}
                    {/* Overlay text */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent flex flex-col justify-center px-8 sm:px-14">
                         <p className="text-white/70 text-xs font-semibold tracking-[0.25em] uppercase mb-1">
                              Shop
                         </p>
                         <h1
                              className="text-white font-black text-3xl sm:text-5xl leading-tight tracking-tight"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                         >
                              {categoryLabel}'s
                         </h1>
                    </div>
               </div>

               {/* ── Toolbar ── */}
               <div
                    className={`flex items-center justify-between mb-8 gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                         }`}
               >
                    {/* Count */}
                    <p className="text-sm text-zinc-500">
                         Showing{' '}
                         <span className="font-bold text-zinc-800">{start}–{end}</span>{' '}
                         of{' '}
                         <span className="font-bold text-zinc-800">{totalCount}</span>{' '}
                         products
                    </p>

                    {/* Sort dropdown */}
                    <div ref={sortRef} className="relative">
                         <button
                              onClick={() => setSortOpen(o => !o)}
                              className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-400 transition-colors duration-200 bg-white"
                         >
                              <i className="fa-solid fa-arrow-up-wide-short text-zinc-400 text-xs" />
                              {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                              <i className={`fa-solid fa-angle-down text-zinc-400 text-xs transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                         </button>

                         {sortOpen && (
                              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden z-20 animate-[fadeUp_0.2s_ease-out]">
                                   {SORT_OPTIONS.map(({ label, value }) => (
                                        <button
                                             key={value}
                                             onClick={() => { setSortBy(value); setSortOpen(false); }}
                                             className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center justify-between
                    ${sortBy === value
                                                       ? 'bg-zinc-50 text-zinc-900 font-semibold'
                                                       : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
                                                  }`}
                                        >
                                             {label}
                                             {sortBy === value && <i className="fa-solid fa-check text-rose-500 text-xs" />}
                                        </button>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

               {/* ── Product grid ── */}
               {totalCount === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 text-2xl">
                              <i className="fa-solid fa-shirt" />
                         </div>
                         <p className="text-zinc-400 text-sm">No products found in this category.</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                         {shown.map((item, i) => (
                              <div
                                   key={item.id ?? i}
                                   className="opacity-0 animate-[fadeUp_0.45s_ease-out_forwards]"
                                   style={{ animationDelay: `${(i % PAGE_SIZE) * 45}ms` }}
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

               {/* ── Load more ── */}
               {hasMore && (
                    <div className="flex flex-col items-center gap-3 mt-14">
                         {/* Progress bar */}
                         <div className="w-48 h-1 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                   className="h-full bg-zinc-800 rounded-full transition-all duration-500"
                                   style={{ width: `${(shown.length / totalCount) * 100}%` }}
                              />
                         </div>
                         <p className="text-zinc-400 text-xs">
                              Showing {shown.length} of {totalCount}
                         </p>
                         <button
                              onClick={() => setPage(p => p + 1)}
                              className="group flex items-center gap-3 px-8 py-3.5 border border-zinc-800 rounded-full text-sm font-semibold tracking-wide text-zinc-800 hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 active:scale-95 mt-2"
                         >
                              Explore More
                              <i className="fa-solid fa-arrow-down text-xs group-hover:translate-y-1 transition-transform duration-200" />
                         </button>
                    </div>
               )}

               {/* ── All loaded state ── */}
               {!hasMore && totalCount > 0 && (
                    <div className="flex items-center gap-4 mt-14 justify-center">
                         <div className="h-px flex-1 max-w-30 bg-zinc-200" />
                         <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase">
                              You've seen it all
                         </p>
                         <div className="h-px flex-1 max-w-30 bg-zinc-200" />
                    </div>
               )}

          </div>
     );
};

export default ShopCategory;