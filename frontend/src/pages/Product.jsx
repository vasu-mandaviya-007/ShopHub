// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api_paths from '../config/apis';
// // import ClipLoader from 'react-spinners/ClipLoader';
// // import { Circles } from 'react-loader-spinner';

// import Breadcrums from '../components/Breadcrums/Breadcrums';
// import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
// import DiscriptionBox from '../components/DiscriptionBox/DiscriptionBox';
// import RelatedProducts from '../components/RelatedProducts/RelatedProducts';
// import Loader from '../components/Loader/Loader';

// const Product = () => {

//      const { productId } = useParams();

//      const [product, setproduct] = useState(null);
//      const [loading, setLoading] = useState(true);

//      const findproduct = async () => {

//           try {

//                setLoading(true); // Start loading

//                const response = await fetch(`${api_paths.singleproduct}/${productId}`)

//                if (!response.ok) {
//                     throw new Error(`Failed to fetch product: ${response.statusText}`);
//                }

//                const data = await response.json();
//                setproduct(data);

//           } catch (error) {

//                console.error(error);

//           } finally {

//                setLoading(false); // Stop loading

//           }

//      };

//      useEffect(() => {

//           findproduct();

//      }, [productId]);


//      if (loading) {
//           // Show spinner while loading
//           return (

//                <Loader />

//           );

//      }

//      return (

//           <div>

//                <Breadcrums product={product} />
//                <ProductDisplay product={product} />
//                <DiscriptionBox />
//                <RelatedProducts />

//           </div>

//      );

// }

// export default Product;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api_paths from '../config/apis';
import Breadcrums from '../components/Breadcrums';
import ProductDisplay from '../components/ProductDisplay';
import DiscriptionBox from '../components/DiscriptionBox';
import RelatedProducts from '../components/RelatedProducts';

/* Skeleton for the full product page */
const ProductSkeleton = () => (
     <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-72 bg-zinc-200 rounded mb-10" />
          <div className="flex flex-col lg:flex-row gap-12">
               {/* Left image skeleton */}
               <div className="flex gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                         {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="w-16 h-20 bg-zinc-200 rounded-xl" />
                         ))}
                    </div>
                    <div className="flex-1 aspect-3/4 bg-zinc-200 rounded-2xl" />
               </div>
               {/* Right info skeleton */}
               <div className="flex-1 flex flex-col gap-4">
                    <div className="h-8 w-3/4 bg-zinc-200 rounded" />
                    <div className="h-4 w-32 bg-zinc-200 rounded" />
                    <div className="h-6 w-48 bg-zinc-200 rounded mt-2" />
                    <div className="space-y-2 mt-4">
                         <div className="h-3 w-full bg-zinc-200 rounded" />
                         <div className="h-3 w-5/6 bg-zinc-200 rounded" />
                         <div className="h-3 w-4/6 bg-zinc-200 rounded" />
                    </div>
                    <div className="flex gap-3 mt-6">
                         {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                              <div key={s} className="w-12 h-12 bg-zinc-200 rounded-xl" />
                         ))}
                    </div>
                    <div className="h-12 w-48 bg-zinc-200 rounded-full mt-4" />
               </div>
          </div>
     </div>
);

const Product = () => {
     const { productId } = useParams();
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const findProduct = async () => {
          try {
               setLoading(true);
               setError(null);
               const response = await fetch(`${api_paths.singleproduct}/${productId}`);
               if (!response.ok) throw new Error(response.statusText);
               const data = await response.json();
               setProduct(data);
          } catch (err) {
               console.error(err);
               setError(err.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => { findProduct(); }, [productId]);

     if (loading) return <ProductSkeleton />;

     if (error || !product) return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
               <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-2xl">
                    <i className="fa-solid fa-circle-exclamation" />
               </div>
               <h2 className="text-xl font-bold text-zinc-800">Product not found</h2>
               <p className="text-zinc-400 text-sm">This item may have been removed or the link is broken.</p>
               <div className="flex gap-3">
                    <button onClick={findProduct} className="px-5 py-2 text-xs font-semibold tracking-widest uppercase border border-zinc-300 rounded-full hover:border-rose-400 hover:text-rose-500 transition-colors">
                         Retry
                    </button>
                    <Link to="/" className="px-5 py-2 text-xs font-semibold tracking-widest uppercase bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors">
                         Go Home
                    </Link>
               </div>
          </div>
     );

     return (
          <div>
               <Breadcrums product={product} />
               <ProductDisplay product={product} />
               <DiscriptionBox />
               <RelatedProducts category={product.category} currentId={product.id} />
          </div>
     );
};

export default Product;