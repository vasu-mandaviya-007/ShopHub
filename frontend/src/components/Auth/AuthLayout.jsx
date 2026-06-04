// /**
//  * AuthLayout — shared dark-card wrapper for all auth pages
//  * Usage: <AuthLayout title="Login" subtitle="Welcome back">…fields…</AuthLayout>
//  */
// import React from 'react';
// import { Link } from 'react-router-dom';

// const AuthLayout = ({ title, subtitle, children }) => (
//     <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
//         {/* Background blobs */}
//         <div className="pointer-events-none fixed inset-0 overflow-hidden">
//             <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/15 blur-[100px]" />
//             <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-400/10 blur-[100px]" />
//         </div>

//         <div className="relative w-full max-w-md">
//             {/* Logo */}
//             <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
//                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-rose-500/30">
//                     <i className="fa-solid fa-bag-shopping text-white text-sm" />
//                 </div>
//                 <span className="text-white font-semibold text-lg tracking-tight">
//                     Shop<span className="text-rose-400">Ease</span>
//                 </span>
//             </Link>

//             {/* Card */}
//             <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
//                 {/* Top colour bar */}
//                 <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

//                 <div className="px-8 pt-8 pb-10">
//                     {/* Heading */}
//                     <div className="mb-8 text-center">
//                         <h1
//                             className="text-2xl font-black text-zinc-900 mb-1"
//                             style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
//                         >
//                             {title}
//                         </h1>
//                         {subtitle && (
//                             <p className="text-zinc-400 text-sm">{subtitle}</p>
//                         )}
//                     </div>

//                     {children}
//                 </div>
//             </div>

//             <p className="text-center text-zinc-600 text-xs mt-6">
//                 © {new Date().getFullYear()} ShopEase. All rights reserved.
//             </p>
//         </div>

//         <style>{`
//       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
//     `}</style>
//     </div>
// );

// export default AuthLayout;


/**
 * AuthLayout — shared light-mode wrapper for all auth pages
 * Usage: <AuthLayout title="Login" subtitle="Welcome back">…fields…</AuthLayout>
 */
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children }) => (

    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4 py-12 relative overflow-hidden">

        {/* ── Decorative background blobs ── */}
        {/* <div className="pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-200/50 blur-[90px]" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-200/50 blur-[90px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-blue-100/40 blur-[120px]" />
        </div> */}

        {/* ── Decorative dot grid (top-left) ── */}
        <div
            className="pointer-events-none fixed top-0 left-0 w-64 h-64 opacity-[0.07]"
            style={{
                backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
                backgroundSize: '22px 22px',
            }}
        />

        <div className="relative w-full max-w-md">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
                    <i className="fa-solid fa-bag-shopping text-white text-sm" />
                </div>
                <span className="text-zinc-800 font-semibold text-lg tracking-tight">
                    Shop<span className="text-blue-500">Ease</span>
                </span>
            </Link>

            {/* ── Card ── */}
            <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/80 border border-zinc-100 overflow-hidden">

                {/* Gradient top bar */}
                <div className="h-1.5 bg-linear-to-r from-blue-500 to-cyan-400" />

                <div className="px-8 pt-8 pb-10">

                    {/* Heading */}
                    <div className="mb-7 text-center">
                        <h1
                            className="text-2xl font-black text-zinc-900 mb-1.5 font-serif"
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-zinc-400 text-sm leading-relaxed">{subtitle}</p>
                        )}
                    </div>

                    {children}
                </div>
            </div>

            {/* Footer note */}
            {/* <p className="text-center text-zinc-400 text-xs mt-5">
                © {new Date().getFullYear()} ShopEase — All rights reserved.
            </p> */}
        </div>

    </div>
);

export default AuthLayout;