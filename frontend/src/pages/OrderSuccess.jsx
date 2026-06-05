// import React, { useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// // import { ShopContext } from '../context/ShopContext'; 

// const OrderSuccess = () => {
//     // Agar future me context se cart clear karna ho to yahan use kar sakte ho
//     // const { clearCart } = useContext(ShopContext);

//     // useEffect(() => {
//     //     clearCart(); // Order success hone par cart empty karne ke liye
//     // }, []);

//     return (
//         <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
//             <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
//                 <i className="fa-solid fa-check text-4xl text-emerald-500"></i>
//             </div>

//             <h1 className="text-4xl font-black text-zinc-900 mb-3 font-serif">Order Confirmed!</h1>
//             <p className="text-zinc-500 max-w-md mb-8">
//                 Thank you for your purchase. We've received your order and will send you an email with the tracking details shortly.
//             </p>

//             <div className="flex flex-wrap justify-center gap-4">
//                 <Link to="/">
//                     <button className="px-8 py-3.5 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
//                         Continue Shopping
//                     </button>
//                 </Link>
//                 <Link to="/orders">
//                     <button className="px-8 py-3.5 bg-white text-zinc-800 font-bold rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all">
//                         View Orders
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default OrderSuccess;



// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const OrderSuccess = () => {
//     const navigate = useNavigate();
//     const [order, setOrder] = useState(null);
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const raw = sessionStorage.getItem('lastOrder');
//         if (!raw) { navigate('/'); return; }
//         setOrder(JSON.parse(raw));
//         // Trigger entrance animation
//         setTimeout(() => setVisible(true), 50);
//     }, [navigate]);

//     if (!order) return null;

//     const { orderId, shipping, payment, total, totalItems, shippingFee, discountAmt, promoCode, discount } = order;

//     const paymentLabel = (() => {
//         if (payment.method === 'card') return `Card ending ····${payment.last4}`;
//         if (payment.method === 'upi') return `UPI: ${payment.upiId}`;
//         return 'Cash on Delivery';
//     })();

//     // Estimated delivery: 3–6 business days from today
//     const today = new Date();
//     const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
//     const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
//     const deliveryFrom = formatDate(addDays(today, 3));
//     const deliveryTo = formatDate(addDays(today, 6));

//     return (
//         <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-cyan-50 flex items-start justify-center pt-12 pb-20 px-4">
//             <div
//                 className="w-full max-w-lg transition-all duration-700"
//                 style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
//             >

//                 {/* Success badge */}
//                 <div className="flex flex-col items-center text-center mb-10">
//                     <div className="relative">
//                         {/* Rings */}
//                         <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" style={{ animationDuration: '2s' }} />
//                         <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10">
//                             <i className="fa-solid fa-check text-white text-4xl" />
//                         </div>
//                     </div>
//                     <h1
//                         className="text-3xl sm:text-4xl font-black text-zinc-900 mt-6 leading-tight"
//                         style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
//                     >
//                         Order Placed!
//                     </h1>
//                     <p className="text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
//                         Thank you, <span className="font-semibold text-zinc-600">{shipping.firstName}</span>! Your order has been confirmed and is being processed.
//                     </p>

//                     {/* Order ID pill */}
//                     <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-full text-sm">
//                         <i className="fa-solid fa-receipt text-zinc-400 text-xs" />
//                         <span className="font-mono font-bold tracking-widest">{orderId}</span>
//                     </div>
//                 </div>

//                 {/* Details card */}
//                 <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">

//                     {/* Estimated delivery */}
//                     <div className="px-6 py-5 bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
//                             <i className="fa-solid fa-truck-fast text-white" />
//                         </div>
//                         <div>
//                             <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Estimated Delivery</p>
//                             <p className="text-white font-bold text-sm mt-0.5">{deliveryFrom} – {deliveryTo}</p>
//                         </div>
//                     </div>

//                     {/* Info rows */}
//                     <div className="divide-y divide-zinc-100">

//                         <InfoRow icon="fa-location-dot" label="Deliver To">
//                             <p className="font-semibold text-zinc-800 text-sm">{shipping.firstName} {shipping.lastName}</p>
//                             <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
//                                 {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''}, {shipping.city}, {shipping.state} – {shipping.pin}
//                             </p>
//                             <p className="text-zinc-400 text-xs">{shipping.phone}</p>
//                         </InfoRow>

//                         <InfoRow icon="fa-credit-card" label="Payment">
//                             <p className="text-sm font-semibold text-zinc-800">{paymentLabel}</p>
//                         </InfoRow>

//                         <InfoRow icon="fa-envelope" label="Confirmation sent to">
//                             <p className="text-sm font-semibold text-zinc-800">{shipping.email}</p>
//                         </InfoRow>

//                         {/* Price summary */}
//                         <div className="px-6 py-5">
//                             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
//                                 <i className="fa-solid fa-receipt mr-1.5" />Price Breakdown
//                             </p>
//                             <div className="flex flex-col gap-2 text-sm">
//                                 <div className="flex justify-between text-zinc-500">
//                                     <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
//                                     <span>₹{(total - shippingFee + discountAmt).toLocaleString('en-IN')}</span>
//                                 </div>
//                                 {discountAmt > 0 && (
//                                     <div className="flex justify-between text-emerald-600">
//                                         <span>Promo ({promoCode?.toUpperCase()}) – {Math.round(discount * 100)}% off</span>
//                                         <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
//                                     </div>
//                                 )}
//                                 <div className="flex justify-between text-zinc-500">
//                                     <span>Shipping</span>
//                                     <span className={shippingFee === 0 ? 'text-emerald-600' : ''}>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
//                                 </div>
//                                 <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base mt-1">
//                                     <span>Total Paid</span>
//                                     <span>₹{total.toLocaleString('en-IN')}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col sm:flex-row gap-3 mt-8">
//                     <Link to="/" className="flex-1">
//                         <button className="w-full py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
//                             <i className="fa-solid fa-bag-shopping text-xs" /> Continue Shopping
//                         </button>
//                     </Link>
//                     <button
//                         onClick={() => window.print()}
//                         className="flex-1 py-3.5 border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
//                     >
//                         <i className="fa-solid fa-print text-xs" /> Print Receipt
//                     </button>
//                 </div>

//                 <p className="text-center text-zinc-400 text-[11px] mt-5">
//                     Questions? Email us at <span className="text-zinc-600 font-medium">support@yourshop.com</span>
//                 </p>
//             </div>

//             <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
//         </div>
//     );
// };

// const InfoRow = ({ icon, label, children }) => (
//     <div className="px-6 py-4 flex gap-4">
//         <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
//             <i className={`fa-solid ${icon} text-zinc-400 text-xs`} />
//         </div>
//         <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
//             {children}
//         </div>
//     </div>
// );

// export default OrderSuccess;








import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const orderId = sessionStorage.getItem('lastOrderId');
        if (!orderId) { navigate('/'); return; }

        const token = localStorage.getItem('auth-token');
        if (!token) { navigate('/login'); return; }

        fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
            headers: { 'auth-token': token },
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setOrder(data.order);
                    setTimeout(() => setVisible(true), 50);
                } else {
                    setError(data.error || 'Could not load order details.');
                }
            })
            .catch(() => setError('Network error. Could not load order.'))
            .finally(() => setLoading(false));
    }, [navigate]);

    // Helpers
    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-zinc-300" />
                    <p className="text-zinc-400 text-sm">Loading your order…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center flex flex-col items-center gap-4">
                    <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-400" />
                    <p className="text-zinc-600 font-semibold">{error}</p>
                    <Link to="/"><button className="px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl">Go Home</button></Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const { orderId, shipping, payment, pricing, items, placedAt } = order;

    const paymentLabel = (() => {
        if (payment.method === 'card') return `Card ending ····${payment.last4}`;
        if (payment.method === 'upi') return `UPI: ${payment.upiId}`;
        return 'Cash on Delivery';
    })();

    const deliveryFrom = formatDate(addDays(placedAt, 3));
    const deliveryTo = formatDate(addDays(placedAt, 6));

    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-cyan-50 flex items-start justify-center pt-12 pb-20 px-4">
            <div className="w-full max-w-lg transition-all duration-700"
                style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}>

                {/* Success hero */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40"
                            style={{ animationDuration: '2s' }} />
                        <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10">
                            <i className="fa-solid fa-check text-white text-4xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-6 leading-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Order Placed!
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
                        Thank you, <span className="font-semibold text-zinc-600">{shipping.firstName}</span>!
                        Your order has been confirmed and is being processed.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-full text-sm">
                        <i className="fa-solid fa-receipt text-zinc-400 text-xs" />
                        <span className="font-mono font-bold tracking-widest">{orderId}</span>
                    </div>
                </div>

                {/* Details card */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">

                    {/* Delivery banner */}
                    <div className="px-6 py-5 bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-truck-fast text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Estimated Delivery</p>
                            <p className="text-white font-bold text-sm mt-0.5">{deliveryFrom} – {deliveryTo}</p>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div className="divide-y divide-zinc-100">

                        {/* Items ordered */}
                        <div className="px-6 py-5">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                                <i className="fa-solid fa-bag-shopping mr-1.5" />Items Ordered
                            </p>
                            <div className="flex flex-col gap-3">
                                {items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name}
                                            className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                                            <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-800 shrink-0">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <InfoRow icon="fa-location-dot" label="Deliver To">
                            <p className="font-semibold text-zinc-800 text-sm">{shipping.firstName} {shipping.lastName}</p>
                            <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                                {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''},&nbsp;
                                {shipping.city}, {shipping.state} – {shipping.pin}
                            </p>
                            <p className="text-zinc-400 text-xs">{shipping.phone}</p>
                        </InfoRow>

                        <InfoRow icon="fa-credit-card" label="Payment">
                            <p className="text-sm font-semibold text-zinc-800">{paymentLabel}</p>
                        </InfoRow>

                        <InfoRow icon="fa-envelope" label="Confirmation sent to">
                            <p className="text-sm font-semibold text-zinc-800">{shipping.email}</p>
                        </InfoRow>

                        {/* Price breakdown */}
                        <div className="px-6 py-5">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                                <i className="fa-solid fa-receipt mr-1.5" />Price Breakdown
                            </p>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-zinc-500">
                                    <span>{items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                                    <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {pricing.discountAmt > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Promo ({pricing.promoCode?.toUpperCase()}) – {Math.round(pricing.discount * 100)}% off</span>
                                        <span>−₹{pricing.discountAmt.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-zinc-500">
                                    <span>Shipping</span>
                                    <span className={pricing.shippingFee === 0 ? 'text-emerald-600' : ''}>
                                        {pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}
                                    </span>
                                </div>
                                <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base mt-1">
                                    <span>Total Paid</span>
                                    <span>₹{pricing.total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link to="/" className="flex-1">
                        <button className="w-full py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-bag-shopping text-xs" /> Continue Shopping
                        </button>
                    </Link>
                    <button onClick={() => window.print()}
                        className="flex-1 py-3.5 border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                        <i className="fa-solid fa-print text-xs" /> Print Receipt
                    </button>
                </div>

                <p className="text-center text-zinc-400 text-[11px] mt-5">
                    Questions? Email us at <span className="text-zinc-600 font-medium">support@yourshop.com</span>
                </p>
            </div>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
        </div>
    );
};

const InfoRow = ({ icon, label, children }) => (
    <div className="px-6 py-4 flex gap-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
            <i className={`fa-solid ${icon} text-zinc-400 text-xs`} />
        </div>
        <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
            {children}
        </div>
    </div>
);

export default OrderSuccess;