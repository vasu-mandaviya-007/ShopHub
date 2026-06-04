// import React, { useContext, useState } from 'react';
// import logo from '../../assets/logo.png';
// import './Navbar.css';
// import { Link } from 'react-router-dom';
// import { ShopContext } from '../../context/ShopContext';
// import Swal from 'sweetalert2';

// const Navbar = () => {
//      const [menu, setMenu] = useState("shop");
//      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu
//      const { getTotalCartItems } = useContext(ShopContext);

//      const logout = async () => {
//           let results = false;

//           Swal.fire({
//                title: 'Are you sure?',
//                text: "After Logout You have to login again!",
//                icon: 'warning',
//                showCancelButton: true,
//                confirmButtonText: `<i class="fa-solid fa-power-off"></i> Logout`,
//                cancelButtonText: 'Cancel',
//                showLoaderOnConfirm: true,
//           })
//                .then(async (result) => {
//                     if (result.isConfirmed) {
//                          await Swal.fire({
//                               title: "Logout Successfull",
//                               icon: "success",
//                          });
//                          localStorage.removeItem('auth-token');
//                          window.location.replace('/');
//                     }
//                });
//      }

//      return (
//           <div className='navbar'>
//                <div className="nav-logo">
//                     <img src={logo} alt="Logo" />
//                </div>

//                {/* Mobile Menu Toggle Button */}
//                <div className="nav-mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//                     <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
//                </div>

//                {/* Added dynamic class for mobile responsiveness */}
//                <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
//                     <li onClick={() => { setMenu("shop"); setIsMobileMenuOpen(false); }}><Link to='/'>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
//                     <li onClick={() => { setMenu("mens"); setIsMobileMenuOpen(false); }}><Link to='/mens'>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
//                     <li onClick={() => { setMenu("womens"); setIsMobileMenuOpen(false); }}><Link to='/womens'>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
//                     <li onClick={() => { setMenu("kids"); setIsMobileMenuOpen(false); }}><Link to='/kids'>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
//                </ul>

//                <div className="nav-login-cart">
//                     {
//                          localStorage.getItem("auth-token")
//                               ? <button onClick={() => logout()}>Logout</button>
//                               : <Link to='/login' > <button>Login</button></Link>
//                     }
//                     <div className="cart-box">
//                          <Link to='/cart'><i className="cart-icon fa-solid fa-cart-shopping"></i></Link>
//                          <div className="nav-cart-count">{getTotalCartItems()}</div>
//                     </div>
//                </div>
//           </div>
//      );
// }

// export default Navbar;


// import React, { useContext, useState, useEffect } from 'react';
// import logo from '../../assets/logo.png';
// import { Link, useLocation } from 'react-router-dom';
// import { ShopContext } from '../../context/ShopContext';
// import Swal from 'sweetalert2';

// const NAV_LINKS = [
//      { label: 'Shop', path: '/', key: 'shop' },
//      { label: 'Men', path: '/mens', key: 'mens' },
//      { label: 'Women', path: '/womens', key: 'womens' },
//      { label: 'Kids', path: '/kids', key: 'kids' },
// ];

// const Navbar = () => {
//      const location = useLocation();
//      const [mobileOpen, setMobileOpen] = useState(false);
//      const [scrolled, setScrolled] = useState(false);
//      const { getTotalCartItems } = useContext(ShopContext);

//      // Close mobile menu on route change
//      useEffect(() => {
//           setMobileOpen(false);
//      }, [location.pathname]);

//      // Shrink navbar on scroll
//      useEffect(() => {
//           const onScroll = () => setScrolled(window.scrollY > 20);
//           window.addEventListener('scroll', onScroll);
//           return () => window.removeEventListener('scroll', onScroll);
//      }, []);

//      const logout = () => {
//           Swal.fire({
//                title: 'Are you sure?',
//                text: 'After logout you will need to sign in again.',
//                icon: 'warning',
//                showCancelButton: true,
//                confirmButtonText: '<i class="fa-solid fa-power-off"></i> Logout',
//                cancelButtonText: 'Cancel',
//                background: '#0f0f0f',
//                color: '#fff',
//                confirmButtonColor: '#ef4444',
//           }).then(async (result) => {
//                if (result.isConfirmed) {
//                     await Swal.fire({
//                          title: 'Logged out successfully',
//                          icon: 'success',
//                          background: '#0f0f0f',
//                          color: '#fff',
//                     });
//                     localStorage.removeItem('auth-token');
//                     window.location.replace('/');
//                }
//           });
//      };

//      const cartCount = getTotalCartItems();
//      const isLoggedIn = !!localStorage.getItem('auth-token');

//      return (
//           <>
//                {/* ── Main Navbar ── */}
//                <header
//                     className={`sticky top-0 z-50 transition-all duration-500 
//                          ${scrolled
//                               ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_2px_30px_rgba(0,0,0,0.5)] py-3'
//                               : 'bg-[#0a0a0a] py-4'
//                          }`
//                     }
//                >
//                     <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

//                          {/* Logo */}
//                          <Link to="/" className="flex items-center gap-2 shrink-0 group">
//                               <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-shadow duration-300">
//                                    <img
//                                         src={logo}
//                                         alt="Logo"
//                                         className="h-7 w-7 object-contain brightness-0 invert"
//                                         onError={(e) => {
//                                              e.target.style.display = 'none';
//                                              e.target.nextSibling.style.display = 'block';
//                                         }}
//                                    />
//                                    {/* Fallback text logo */}
//                                    <span className="hidden text-white font-bold text-lg tracking-tight">S</span>
//                               </div>
//                               <span className="text-white font-semibold text-lg tracking-tight hidden sm:block">
//                                    Shop<span className="text-rose-400">Ease</span>
//                               </span>
//                          </Link>

//                          {/* Desktop Nav Links */}
//                          <ul className="hidden md:flex items-center gap-1">
//                               {NAV_LINKS.map(({ label, path, key }) => {
//                                    const isActive = location.pathname === path;
//                                    return (
//                                         <li key={key}>
//                                              <Link
//                                                   to={path}
//                                                   className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-all duration-200 group
//                                                        ${isActive
//                                                             ? 'text-white'
//                                                             : 'text-zinc-400 hover:text-white'
//                                                        }
//                                                   `}
//                                              >
//                                                   {isActive && (
//                                                        <span className="absolute inset-0 bg-white/10 rounded-lg" />
//                                                   )}
//                                                   {/* Hover background */}
//                                                   <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-colors duration-200" />
//                                                   <span className="relative">{label}</span>
//                                                   {/* Active underline dot */}
//                                                   {isActive && (
//                                                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-400 rounded-full" />
//                                                   )}
//                                              </Link>
//                                         </li>
//                                    );
//                               })}
//                          </ul>

//                          {/* Right Side Actions */}
//                          <div className="flex items-center gap-3">
//                               {/* Auth Button */}
//                               {isLoggedIn ? (
//                                    <button
//                                         onClick={logout}
//                                         className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 border border-zinc-700 rounded-full hover:border-rose-500 hover:text-rose-400 transition-all duration-200"
//                                    >
//                                         <i className="fa-solid fa-power-off text-xs" />
//                                         Logout
//                                    </button>
//                               ) : (
//                                    <Link to="/login">
//                                         <button className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-cyan-400 rounded-full hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all duration-200 active:scale-95">
//                                              <i className="fa-solid fa-user text-xs" />
//                                              Login
//                                         </button>
//                                    </Link>
//                               )}

//                               {/* Cart */}
//                               <Link
//                                    to="/cart"
//                                    className="relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 text-zinc-300 hover:border-rose-500 hover:text-white transition-all duration-200 group"
//                               >
//                                    <i className="fa-solid fa-bag-shopping text-base group-hover:scale-110 transition-transform duration-200" />
//                                    {cartCount > 0 && (
//                                         <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center shadow-md shadow-rose-500/40 animate-bounce">
//                                              {cartCount > 99 ? '99+' : cartCount}
//                                         </span>
//                                    )}
//                               </Link>

//                               {/* Mobile Hamburger */}
//                               <button
//                                    onClick={() => setMobileOpen((p) => !p)}
//                                    aria-label="Toggle menu"
//                                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-zinc-700 gap-1.25 hover:border-zinc-500 transition-colors duration-200"
//                               >
//                                    <span
//                                         className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''
//                                              }`}
//                                    />
//                                    <span
//                                         className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''
//                                              }`}
//                                    />
//                                    <span
//                                         className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 translate-y-[-6.5px]' : ''
//                                              }`}
//                                    />
//                               </button>
//                          </div>
//                     </nav>

//                     {/* ── Mobile Drawer ── */}
//                     <div
//                          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                               }`}
//                     >
//                          <div className="px-4 pb-4 pt-2 border-t border-zinc-800">

//                               <ul className="space-y-1 mb-4">

//                                    {NAV_LINKS.map(({ label, path, key }) => {

//                                         const isActive = location.pathname === path;

//                                         return (

//                                              <li key={key}>

//                                                   <Link
//                                                        to={path}
//                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
//                                                   >
//                                                        {isActive && (
//                                                             <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
//                                                        )}
//                                                        {!isActive && (
//                                                             <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
//                                                        )}
//                                                        {label}
//                                                   </Link>

//                                              </li>

//                                         );

//                                    })}

//                               </ul>

//                               {/* Mobile Auth */}
//                               <div className="pt-3 border-t border-zinc-800">
//                                    {isLoggedIn ? (
//                                         <button
//                                              onClick={logout}
//                                              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-rose-400 border border-rose-500/40 rounded-xl hover:bg-rose-500/10 transition-all duration-200"
//                                         >
//                                              <i className="fa-solid fa-power-off text-xs" />
//                                              Logout
//                                         </button>
//                                    ) : (
//                                         <Link to="/login" className="block">
//                                              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-cyan-400 rounded-xl hover:opacity-90 transition-all duration-200">
//                                                   <i className="fa-solid fa-user text-xs" />
//                                                   Login to your account
//                                              </button>
//                                         </Link>
//                                    )}
//                               </div>
//                          </div>
//                     </div>

//                </header>

//                {/* Spacer so content doesn't go under fixed navbar */}
//                {/* <div className={`transition-all duration-500 ${scrolled ? 'h-[60px]' : 'h-[72px]'}`} /> */}
//           </>
//      );
// };

// export default Navbar;


import React, { useContext, useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ShopContext } from '../context/ShopContext';

const NAV_LINKS = [
     { label: 'Shop', path: '/', key: 'shop' },
     { label: 'Men', path: '/mens', key: 'mens' },
     { label: 'Women', path: '/womens', key: 'womens' },
     { label: 'Kids', path: '/kids', key: 'kids' },
];

const Navbar = () => {
     const location = useLocation();
     const navigate = useNavigate();
     const { getTotalCartItems, user, isloading } = useContext(ShopContext);

     const [mobileOpen, setMobileOpen] = useState(false);
     const [scrolled, setScrolled] = useState(false);
     const [dropOpen, setDropOpen] = useState(false);
     const dropRef = useRef(null);
     const isLoggedIn = !!localStorage.getItem('auth-token');
     const cartCount = getTotalCartItems();

     /* avatar initials from context user */
     const initials = user?.name
          ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
          : '?';

     /* Close mobile menu on route change */
     useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location.pathname]);

     /* Scroll shrink */
     useEffect(() => {

          const fn = () => setScrolled(window.scrollY > 20);
          window.addEventListener('scroll', fn);
          return () => window.removeEventListener('scroll', fn);
     }, []);

     /* Close dropdown on outside click */
     useEffect(() => {
          const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
          document.addEventListener('mousedown', fn);
          return () => document.removeEventListener('mousedown', fn);
     }, []);

     const logout = () => {
          setDropOpen(false);
          Swal.fire({
               title: 'Logging out?',
               text: 'You will need to sign in again.',
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Logout',
               confirmButtonColor: '#ef4444',
               background: '#0f0f0f',
               color: '#fff',
          }).then(({ isConfirmed }) => {
               if (isConfirmed) { localStorage.removeItem('auth-token'); window.location.replace('/'); }
          });
     };

     const DROPDOWN_ITEMS = [
          { icon: 'fa-user', label: 'My Profile', to: '/account?tab=profile' },
          { icon: 'fa-bag-shopping', label: 'My Orders', to: '/account?tab=orders' },
          // { icon: 'fa-heart', label: 'Wishlist', to: '/wishlist' },
          // { icon: 'fa-location-dot', label: 'Saved Addresses', to: '/account?tab=addresses' },
     ];

     return (
          <>
               <header className={`sticky top-0 z-50 transition-all duration-500
        ${scrolled
                         ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_2px_30px_rgba(0,0,0,0.5)] py-2'
                         : 'bg-[#0a0a0a] py-4'}`}>

                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                         {/* ── Logo ── */}
                         <Link to="/" onClick={()=> window.scrollTo({top : 0, behavior : "smooth"})} className="flex items-center gap-2 shrink-0">
                              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-400 flex items-center justify-center shadow-lg shadow-rose-500/30">
                                   <img src={logo} alt="Logo" className="h-7 w-7 object-contain brightness-0 invert"
                                        onError={e => { e.target.style.display = 'none'; }} />
                              </div>
                              <span className="text-white font-semibold text-lg tracking-tight hidden sm:block">
                                   Shop<span className="text-blue-400">Ease</span>
                              </span>
                         </Link>

                         {/* ── Desktop nav links ── */}
                         <ul className="hidden md:flex items-center gap-1">
                              {NAV_LINKS.map(({ label, path, key }) => {
                                   const isActive = location.pathname === path;
                                   return (
                                        <li key={key}>
                                             <Link to={path}
                                                  className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-all duration-200 group
                      ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                                                  {isActive && <span className="absolute inset-0 bg-white/10 rounded-lg" />}
                                                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-colors" />
                                                  <span className="relative">{label}</span>
                                                  {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-400 rounded-full" />}
                                             </Link>
                                        </li>
                                   );
                              })}
                         </ul>

                         {/* ── Right side ── */}
                         <div className="flex items-center gap-2.5">

                              {/* Cart */}

                              {
                                   isloading ? (

                                        <div className='rounded-full w-8 h-8 bg-white/20 sm:w-10 sm:h-10 mui-skeleton'>

                                        </div>

                                   ) : (
                                        <Link to="/cart"
                                             className="relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 text-zinc-300 hover:border-rose-500 hover:text-white transition-all duration-200 group">
                                             <i className="fa-solid fa-bag-shopping text-base group-hover:scale-110 transition-transform duration-200" />
                                             {cartCount > 0 && (
                                                  <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center shadow-md shadow-rose-500/40">
                                                       {cartCount > 99 ? '99+' : cartCount}
                                                  </span>
                                             )}
                                        </Link>
                                   )
                              }

                              {/* Auth — desktop */}

                              {

                                   isloading ? (

                                        <div className='rounded-full w-20 h-8 bg-white/20 sm:w-25 sm:h-10 mui-skeleton'>

                                        </div>

                                   ) : isLoggedIn ? (
                                        /* ── Profile dropdown ── */
                                        <div ref={dropRef} className="relative hidden sm:block">
                                             <button
                                                  onClick={() => setDropOpen(o => !o)}
                                                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
                                             >
                                                  {/* Avatar */}
                                                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-400 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                                                       {initials}
                                                  </div>
                                                  {/* Name */}
                                                  <span className="text-zinc-300 text-sm font-medium max-w-22.5 truncate">
                                                       {user?.name?.split(' ')[0] ?? 'Account'}
                                                  </span>
                                                  <i className={`fa-solid fa-angle-down text-zinc-500 text-[11px] transition-transform duration-200 mr-1 ${dropOpen ? 'rotate-180' : ''}`} />
                                             </button>

                                             {/* Dropdown panel */}
                                             {dropOpen && (
                                                  <div className="absolute right-0 top-[calc(100%+10px)] w-70 bg-white rounded-xl shadow-2xl shadow-black/15 overflow-hidden z-50"
                                                       style={{ animation: 'dropFade .18s ease-out' }}>

                                                       {/* User info header */}
                                                       <div className="px-4 py-4 bg-linear-to-br from-zinc-900 to-zinc-800 flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white text-sm font-black shrink-0">
                                                                 {initials}
                                                            </div>
                                                            <div className="min-w-0">
                                                                 <p className="text-white text-base font-bold truncate">{user?.name ?? '—'}</p>
                                                                 <p className="text-zinc-400 text-xs truncate">{user?.email ?? '—'}</p>
                                                            </div>
                                                       </div>

                                                       {/* Menu items */}
                                                       <div className="py-1.5">
                                                            {DROPDOWN_ITEMS.map(({ icon, label, to }) => (
                                                                 <button key={label}
                                                                      onClick={() => { navigate(to); setDropOpen(false); }}
                                                                      className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors text-left group">
                                                                      <span className="w-7 h-7 rounded-lg bg-zinc-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                                                                           <i className={`fa-solid ${icon} text-zinc-400 text-[11px]`} />
                                                                      </span>
                                                                      {label}
                                                                 </button>
                                                            ))}
                                                       </div>

                                                       {/* Logout */}
                                                       <div className="px-3 pb-2 pt-2 border-t border-zinc-100">
                                                            <button onClick={logout}
                                                                 className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors">
                                                                 <span className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                                                      <i className="fa-solid fa-right-from-bracket text-rose-400 text-[12px]" />
                                                                 </span>
                                                                 Logout
                                                            </button>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   ) : (
                                        <Link to="/login" className="hidden sm:block">
                                             <button className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-rose-500 to-orange-400 rounded-full hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all duration-200 active:scale-95">
                                                  <i className="fa-solid fa-user text-xs" />
                                                  Login
                                             </button>
                                        </Link>
                                   )}

                              {/* Mobile hamburger */}
                              <button onClick={() => setMobileOpen(p => !p)} aria-label="Toggle menu"
                                   className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-zinc-700 gap-1.25 hover:border-zinc-500 transition-colors">
                                   <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                                   <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                                   <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 translate-y-[-6.5px]' : ''}`} />
                              </button>
                         </div>
                    </nav>

                    {/* ── Mobile drawer ── */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-130 opacity-100' : 'max-h-0 opacity-0'}`}>
                         <div className="px-4 pb-5 pt-2 border-t border-zinc-800">

                              {/* Logged-in user mini card */}
                              {isLoggedIn && user && (
                                   <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white text-xs font-black shrink-0">
                                             {initials}
                                        </div>
                                        <div className="min-w-0">
                                             <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                             <p className="text-zinc-500 text-[11px] truncate">{user.email}</p>
                                        </div>
                                   </div>
                              )}

                              {/* Nav links */}
                              <ul className="space-y-1 mb-3">
                                   {NAV_LINKS.map(({ label, path, key }) => {
                                        const isActive = location.pathname === path;
                                        return (
                                             <li key={key}>
                                                  <Link to={path}
                                                       className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                                                       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-rose-400' : 'bg-transparent'}`} />
                                                       {label}
                                                  </Link>
                                             </li>
                                        );
                                   })}
                              </ul>

                              {/* Account actions */}
                              <div className="pt-3 border-t border-zinc-800 flex flex-col gap-1">
                                   {isLoggedIn ? (
                                        <>
                                             {DROPDOWN_ITEMS.slice(0, 2).map(({ icon, label, to }) => (
                                                  <Link key={label} to={to}
                                                       className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                                                       <i className={`fa-solid ${icon} text-zinc-600 text-xs w-4 text-center`} />
                                                       {label}
                                                  </Link>
                                             ))}
                                             <button onClick={logout}
                                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/10 transition-all mt-1">
                                                  <i className="fa-solid fa-right-from-bracket text-xs w-4 text-center" />
                                                  Logout
                                             </button>
                                        </>
                                   ) : (
                                        <Link to="/login">
                                             <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-rose-500 to-orange-400 rounded-xl hover:opacity-90 transition-all">
                                                  <i className="fa-solid fa-user text-xs" />
                                                  Login to your account
                                             </button>
                                        </Link>
                                   )}
                              </div>
                         </div>
                    </div>
               </header>

               <style>{`
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
          </>
     );
};

export default Navbar;