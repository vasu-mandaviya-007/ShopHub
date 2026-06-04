// import React from 'react';
// import './RelatedProducts.css'
// import products from '../data';
// import Item from '../Item/Item';

// const RelatedProducts = () => {
//      return (
//           <div className='relatedproducts'>
//                <h1>Related Products</h1>
//                <hr />

//                <div className="relatedproducts-item">
//                     {products.map((item,i) =>{
//                          return <Item key={i} id={item.id} name={item.name} image={item.imgUrl} new_price={item.newPrice} old_price={item.oldPrice}/>
//                     })}
//                </div>
//           </div>
//      );
// }

// export default RelatedProducts;



import React, { useEffect, useState } from 'react';
import Item from './Item';
import api_paths from '../config/apis';

const SkeletonCard = () => (
     <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse shrink-0 w-48 sm:w-56">
          <div className="aspect-3/4 bg-zinc-200" />
          <div className="p-3 flex flex-col gap-2">
               <div className="h-3 bg-zinc-200 rounded w-3/4" />
               <div className="h-3 bg-zinc-200 rounded w-1/2" />
          </div>
     </div>
);

const RelatedProducts = ({ category, currentId }) => {
     const [related, setRelated] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetch_ = async () => {
               try {
                    setLoading(true);
                    // Reuse new-collections endpoint and filter by category client-side
                    const res = await fetch(api_paths.newcollections);
                    const data = await res.json();
                    const filtered = data
                         .filter(p => p.category?.toLowerCase() === category?.toLowerCase() && p.id !== currentId)
                         .slice(0, 8);
                    setRelated(filtered);
               } catch (err) {
                    console.error(err);
               } finally {
                    setLoading(false);
               }
          };
          if (category) fetch_();
     }, [category, currentId]);

     return (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20">

               {/* Header */}
               <div className="flex items-end justify-between mb-8">
                    <div>
                         <div className="flex items-center gap-3 mb-2">
                              <span className="h-px w-8 bg-rose-400" />
                              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-rose-500">
                                   You may also like
                              </span>
                         </div>
                         <h2
                              className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                         >
                              Related Products
                         </h2>
                    </div>
               </div>

               {/* Horizontal scroll on mobile, grid on desktop */}
               <div className="flex gap-4 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 scrollbar-hide">
                    {loading
                         ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                         : related.length > 0
                              ? related.map((item, i) => (
                                   <div
                                        key={item.id ?? i}
                                        className="opacity-0 animate-[fadeUp_0.5s_ease-out_forwards] shrink-0 w-48 sm:w-auto"
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
                              ))
                              : (
                                   <p className="text-zinc-400 text-sm col-span-4 py-8 text-center">
                                        No related products found.
                                   </p>
                              )
                    }
               </div>

          </section>
     );
};

export default RelatedProducts;