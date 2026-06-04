// import React from 'react';
// import './Breadcrums.css';


// const Breadcrums = (props) => {
//      const { product} = props;
//      return (
//           <div className='breadcrum'>
//                HOME <i className='fa-solid fa-angle-right'></i> SHOP <i className='fa-solid fa-angle-right'></i> {product.category} <i className='fa-solid fa-angle-right'></i> { product.name}
//           </div>
//      );
// }

// export default Breadcrums;



import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrums = ({ product }) => {
     const crumbs = [
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.category, to: `/${product.category}` },
          { label: product.name, to: null }, // current — no link
     ];

     return (
          <nav className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-4">
               <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                    {crumbs.map((crumb, i) => {
                         const isLast = i === crumbs.length - 1;
                         return (
                              <React.Fragment key={i}>
                                   {crumb.to ? (
                                        <li>
                                             <Link
                                                  to={crumb.to}
                                                  className="text-zinc-400 hover:text-zinc-700 capitalize transition-colors duration-150"
                                             >
                                                  {crumb.label}
                                             </Link>
                                        </li>
                                   ) : (
                                        <li
                                             className="text-zinc-800 font-semibold capitalize truncate max-w-45 sm:max-w-xs"
                                             aria-current="page"
                                        >
                                             {crumb.label}
                                        </li>
                                   )}
                                   {!isLast && (
                                        <li className="text-zinc-300">
                                             <i className="fa-solid fa-angle-right text-[10px]" />
                                        </li>
                                   )}
                              </React.Fragment>
                         );
                    })}
               </ol>
          </nav>
     );
};

export default Breadcrums;