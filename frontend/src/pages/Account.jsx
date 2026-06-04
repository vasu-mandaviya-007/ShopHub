// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// const API = 'http://localhost:3001';

// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────
// const authHeaders = () => ({
//     'Content-Type': 'application/json',
//     'auth-token': localStorage.getItem('auth-token') || '',
// });

// const fmt = (n) =>
//     Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

// const fmtDate = (d) =>
//     new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// const addDays = (d, n) => {
//     const r = new Date(d);
//     r.setDate(r.getDate() + n);
//     return r;
// };

// // Status badge
// const STATUS_STYLES = {
//     placed: 'bg-blue-50 text-blue-600 border-blue-100',
//     confirmed: 'bg-cyan-50 text-cyan-600 border-cyan-100',
//     shipped: 'bg-amber-50 text-amber-600 border-amber-100',
//     delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
//     cancelled: 'bg-rose-50 text-rose-500 border-rose-100',
// };
// const STATUS_ICONS = {
//     placed: 'fa-receipt',
//     confirmed: 'fa-circle-check',
//     shipped: 'fa-truck-fast',
//     delivered: 'fa-box-open',
//     cancelled: 'fa-ban',
// };

// const StatusBadge = ({ status }) => (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${STATUS_STYLES[status] ?? STATUS_STYLES.placed}`}>
//         <i className={`fa-solid ${STATUS_ICONS[status] ?? 'fa-receipt'} text-[10px]`} />
//         {status}
//     </span>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Toast
// // ─────────────────────────────────────────────────────────────────────────────
// const Toast = ({ msg, type }) => {
//     if (!msg) return null;
//     const styles = type === 'error'
//         ? 'bg-rose-50 border-rose-200 text-rose-600'
//         : 'bg-emerald-50 border-emerald-200 text-emerald-700';
//     const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
//     return (
//         <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium mb-6 ${styles}`}>
//             <i className={`fa-solid ${icon}`} />
//             {msg}
//         </div>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Profile Tab
// // ─────────────────────────────────────────────────────────────────────────────
// const ProfileTab = ({ user, onUserUpdate }) => {
//     const [name, setName] = useState(user?.name || '');
//     const [phone, setPhone] = useState(user?.phone || '');
//     const [saving, setSaving] = useState(false);
//     const [toast, setToast] = useState({ msg: '', type: '' });

//     // Password change
//     const [curPwd, setCurPwd] = useState('');
//     const [newPwd, setNewPwd] = useState('');
//     const [confPwd, setConfPwd] = useState('');
//     const [pwdSaving, setPwdSaving] = useState(false);
//     const [showPwd, setShowPwd] = useState(false);
//     const [pwdToast, setPwdToast] = useState({ msg: '', type: '' });

//     const showToast = (msg, type = 'success', setter = setToast) => {
//         setter({ msg, type });
//         setTimeout(() => setter({ msg: '', type: '' }), 3500);
//     };

//     const handleSaveProfile = async () => {
//         if (!name.trim()) { showToast('Name cannot be empty.', 'error'); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${API}/account/update`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, phone }) });
//             const data = await res.json();
//             if (data.success) { onUserUpdate(data.user); showToast('Profile updated!'); }
//             else showToast(data.error || 'Update failed.', 'error');
//         } catch { showToast('Network error.', 'error'); }
//         setSaving(false);
//     };

//     const handleChangePassword = async () => {
//         if (!curPwd || !newPwd || !confPwd) { showToast('All fields are required.', 'error', setPwdToast); return; }
//         if (newPwd !== confPwd) { showToast('Passwords do not match.', 'error', setPwdToast); return; }
//         if (newPwd.length < 6) { showToast('Password must be at least 6 characters.', 'error', setPwdToast); return; }
//         setPwdSaving(true);
//         try {
//             const res = await fetch(`${API}/account/changepassword`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }) });
//             const data = await res.json();
//             if (data.success) { showToast('Password changed!', 'success', setPwdToast); setCurPwd(''); setNewPwd(''); setConfPwd(''); }
//             else showToast(data.error || 'Failed.', 'error', setPwdToast);
//         } catch { showToast('Network error.', 'error', setPwdToast); }
//         setPwdSaving(false);
//     };

//     const inputCls = 'w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all placeholder-zinc-300 bg-white';
//     const labelCls = 'text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block';

//     return (
//         <div className="flex flex-col gap-8 max-w-xl">

//             {/* Avatar + name hero */}
//             <div className="flex items-center gap-5 p-5 rounded-2xl bg-linear-to-r from-zinc-900 to-zinc-700">
//                 <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0"
//                     style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                     {(user?.name || '?')[0].toUpperCase()}
//                 </div>
//                 <div>
//                     <p className="text-white font-black text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{user?.name || 'Your Name'}</p>
//                     <p className="text-zinc-400 text-xs mt-0.5">{user?.email}</p>
//                     <p className="text-zinc-500 text-[11px] mt-1">Member since {user?.date ? fmtDate(user.date) : '—'}</p>
//                 </div>
//             </div>

//             {/* Edit profile */}
//             <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
//                 <h3 className="text-base font-black text-zinc-900 mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                     Personal Details
//                 </h3>
//                 <Toast msg={toast.msg} type={toast.type} />
//                 <div className="flex flex-col gap-4">
//                     <div>
//                         <label className={labelCls}>Full Name</label>
//                         <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
//                     </div>
//                     <div>
//                         <label className={labelCls}>Email Address</label>
//                         <input className={`${inputCls} bg-zinc-50 cursor-not-allowed text-zinc-400`} value={user?.email || ''} disabled />
//                         <p className="text-[11px] text-zinc-400 mt-1">Email cannot be changed.</p>
//                     </div>
//                     <div>
//                         <label className={labelCls}>Phone Number</label>
//                         <input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
//                     </div>
//                     <button onClick={handleSaveProfile} disabled={saving}
//                         className="mt-1 flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-60">
//                         {saving ? <><i className="fa-solid fa-circle-notch fa-spin" /> Saving…</> : <><i className="fa-solid fa-floppy-disk text-xs" /> Save Changes</>}
//                     </button>
//                 </div>
//             </div>

//             {/* Change password */}
//             <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
//                 <h3 className="text-base font-black text-zinc-900 mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                     Change Password
//                 </h3>
//                 <Toast msg={pwdToast.msg} type={pwdToast.type} />
//                 <div className="flex flex-col gap-4">
//                     {[
//                         { label: 'Current Password', val: curPwd, setter: setCurPwd, ph: '••••••••' },
//                         { label: 'New Password', val: newPwd, setter: setNewPwd, ph: 'Min. 6 characters' },
//                         { label: 'Confirm Password', val: confPwd, setter: setConfPwd, ph: 'Repeat new password' },
//                     ].map(({ label, val, setter, ph }) => (
//                         <div key={label}>
//                             <label className={labelCls}>{label}</label>
//                             <div className="relative">
//                                 <input
//                                     className={inputCls} type={showPwd ? 'text' : 'password'}
//                                     value={val} onChange={e => setter(e.target.value)} placeholder={ph}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                     <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
//                         <input type="checkbox" checked={showPwd} onChange={e => setShowPwd(e.target.checked)} className="accent-zinc-900" />
//                         <span className="text-xs text-zinc-500 font-medium">Show passwords</span>
//                     </label>
//                     <button onClick={handleChangePassword} disabled={pwdSaving}
//                         className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-zinc-900 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-60">
//                         {pwdSaving ? <><i className="fa-solid fa-circle-notch fa-spin" /> Updating…</> : <><i className="fa-solid fa-lock text-xs" /> Update Password</>}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Order Detail Modal
// // ─────────────────────────────────────────────────────────────────────────────
// const OrderModal = ({ order, onClose }) => {
//     if (!order) return null;
//     const { orderId, items, shipping, payment, pricing, status, placedAt } = order;
//     const payLabel = payment.method === 'card' ? `Card ····${payment.last4}` : payment.method === 'upi' ? `UPI: ${payment.upiId}` : 'Cash on Delivery';

//     return (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
//             onClick={onClose}>
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//             <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
//                 onClick={e => e.stopPropagation()}>

//                 {/* Header */}
//                 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
//                     <div>
//                         <p className="font-black text-zinc-900 text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Order Details</p>
//                         <p className="text-xs text-zinc-400 font-mono mt-0.5">{orderId}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <StatusBadge status={status} />
//                         <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
//                             <i className="fa-solid fa-xmark text-zinc-500 text-sm" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Scrollable body */}
//                 <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

//                     {/* Delivery estimate */}
//                     <div className="px-4 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-3">
//                         <i className="fa-solid fa-truck-fast text-white" />
//                         <div>
//                             <p className="text-white/70 text-[11px] uppercase tracking-wide font-medium">Estimated Delivery</p>
//                             <p className="text-white text-sm font-bold">
//                                 {fmtDate(addDays(placedAt, 3))} – {fmtDate(addDays(placedAt, 6))}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Items */}
//                     <div className="rounded-xl border border-zinc-100 overflow-hidden">
//                         <p className="px-4 py-2.5 bg-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">Items</p>
//                         <div className="divide-y divide-zinc-100">
//                             {items.map((item, i) => (
//                                 <div key={i} className="flex items-center gap-3 px-4 py-3">
//                                     <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
//                                         <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
//                                     </div>
//                                     <p className="text-sm font-bold text-zinc-900 shrink-0">₹{fmt(item.price * item.quantity)}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Shipping */}
//                     <div className="rounded-xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Deliver To</p>
//                         <p className="text-sm font-semibold text-zinc-800">{shipping.firstName} {shipping.lastName}</p>
//                         <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
//                             {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''}, {shipping.city}, {shipping.state} – {shipping.pin}
//                         </p>
//                         <p className="text-xs text-zinc-500">{shipping.phone}</p>
//                     </div>

//                     {/* Pricing */}
//                     <div className="rounded-xl border border-zinc-100 p-4 flex flex-col gap-2 text-sm">
//                         <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>₹{fmt(pricing.subtotal)}</span></div>
//                         {pricing.discountAmt > 0 && (
//                             <div className="flex justify-between text-emerald-600">
//                                 <span>Promo ({pricing.promoCode?.toUpperCase()}) – {Math.round(pricing.discount * 100)}% off</span>
//                                 <span>−₹{fmt(pricing.discountAmt)}</span>
//                             </div>
//                         )}
//                         <div className="flex justify-between text-zinc-500">
//                             <span>Shipping</span>
//                             <span className={pricing.shippingFee === 0 ? 'text-emerald-600' : ''}>{pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}</span>
//                         </div>
//                         <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base">
//                             <span>Total</span><span>₹{fmt(pricing.total)}</span>
//                         </div>
//                     </div>

//                     {/* Payment */}
//                     <div className="rounded-xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Payment</p>
//                         <p className="text-sm font-semibold text-zinc-800">{payLabel}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Orders Tab
// // ─────────────────────────────────────────────────────────────────────────────
// const OrdersTab = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selected, setSelected] = useState(null);
//     const [filter, setFilter] = useState('all');

//     useEffect(() => {
//         fetch(`${API}/orders/myorders`, { headers: authHeaders() })
//             .then(r => r.json())
//             .then(data => {
//                 if (data.success) setOrders(data.orders);
//                 else setError(data.error || 'Failed to load orders.');
//             })
//             .catch(() => setError('Network error. Could not load orders.'))
//             .finally(() => setLoading(false));
//     }, []);

//     const STATUS_FILTERS = ['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

//     if (loading) return (
//         <div className="flex flex-col gap-4">
//             {[1, 2, 3].map(i => (
//                 <div key={i} className="h-28 rounded-2xl bg-zinc-100 animate-pulse" />
//             ))}
//         </div>
//     );

//     if (error) return (
//         <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-3">
//             <i className="fa-solid fa-triangle-exclamation" /> {error}
//         </div>
//     );

//     return (
//         <>
//             {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}

//             {/* Filter pills */}
//             {orders.length > 0 && (
//                 <div className="flex gap-2 flex-wrap mb-6">
//                     {STATUS_FILTERS.map(f => (
//                         <button key={f} onClick={() => setFilter(f)}
//                             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border
//                 ${filter === f
//                                     ? 'bg-zinc-900 text-white border-zinc-900'
//                                     : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>
//                             {f}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Empty state */}
//             {orders.length === 0 && (
//                 <div className="flex flex-col items-center text-center py-16 gap-4">
//                     <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
//                         <i className="fa-solid fa-bag-shopping text-zinc-300 text-2xl" />
//                     </div>
//                     <p className="text-zinc-800 font-black text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No orders yet</p>
//                     <p className="text-zinc-400 text-sm max-w-xs">When you place your first order it will show up here.</p>
//                     <Link to="/">
//                         <button className="mt-2 px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors">
//                             Start Shopping
//                         </button>
//                     </Link>
//                 </div>
//             )}

//             {/* No results for filter */}
//             {orders.length > 0 && filtered.length === 0 && (
//                 <div className="py-10 text-center text-zinc-400 text-sm">No {filter} orders.</div>
//             )}

//             {/* Order cards */}
//             <div className="flex flex-col gap-4">
//                 {filtered.map(order => {
//                     const firstItem = order.items[0];
//                     const moreCount = order.items.length - 1;
//                     return (
//                         <button key={order._id} onClick={() => setSelected(order)}
//                             className="w-full text-left bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 overflow-hidden group">
//                             <div className="flex items-stretch">

//                                 {/* Image strip */}
//                                 <div className="w-20 shrink-0 bg-zinc-50 flex items-center justify-center p-3 border-r border-zinc-100">
//                                     <img src={firstItem?.image} alt={firstItem?.name}
//                                         className="w-14 h-14 object-cover rounded-xl" />
//                                 </div>

//                                 {/* Info */}
//                                 <div className="flex-1 min-w-0 px-4 py-4">
//                                     <div className="flex items-start justify-between gap-2 flex-wrap">
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-black text-zinc-900 truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                                                 {firstItem?.name}{moreCount > 0 ? ` +${moreCount} more` : ''}
//                                             </p>
//                                             <p className="text-xs text-zinc-400 font-mono mt-0.5">{order.orderId}</p>
//                                         </div>
//                                         <StatusBadge status={order.status} />
//                                     </div>
//                                     <div className="flex items-center justify-between mt-3">
//                                         <div className="flex items-center gap-3 text-xs text-zinc-400">
//                                             <span><i className="fa-regular fa-calendar mr-1" />{fmtDate(order.placedAt)}</span>
//                                             <span><i className="fa-solid fa-box mr-1" />{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <p className="text-sm font-black text-zinc-900">₹{fmt(order.pricing.total)}</p>
//                                             <i className="fa-solid fa-chevron-right text-zinc-300 text-xs group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>
//         </>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Account Page
// // ─────────────────────────────────────────────────────────────────────────────
// const TABS = [
//     { id: 'profile', label: 'Profile', icon: 'fa-user' },
//     { id: 'orders', label: 'My Orders', icon: 'fa-bag-shopping' },
// ];

// const Account = () => {
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const activeTab = searchParams.get('tab') || 'profile';

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem('auth-token');
//         if (!token) { navigate('/login'); return; }

//         fetch(`${API}/account/profile`, { headers: authHeaders() })
//             .then(r => r.json())
//             .then(data => { if (data.success) setUser(data.user); else navigate('/login'); })
//             .catch(() => navigate('/login'))
//             .finally(() => setLoading(false));
//     }, [navigate]);

//     const handleLogout = () => {
//         localStorage.removeItem('auth-token');
//         navigate('/');
//         window.location.reload();
//     };

//     if (loading) return (
//         <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 animate-pulse">
//             <div className="h-10 w-48 bg-zinc-200 rounded-xl mb-8" />
//             <div className="h-64 bg-zinc-100 rounded-2xl" />
//         </div>
//     );

//     return (
//         <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-16">

//             {/* Page header */}
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h1 className="text-3xl sm:text-4xl font-black text-zinc-900"
//                         style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                         My Account
//                     </h1>
//                     <p className="text-zinc-400 text-sm mt-1">Manage your profile and orders</p>
//                 </div>
//                 <button onClick={handleLogout}
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all">
//                     <i className="fa-solid fa-right-from-bracket" /> Logout
//                 </button>
//             </div>

//             {/* Tab bar */}
//             <div className="flex gap-1 p-1 bg-zinc-100 rounded-2xl mb-8 w-fit">
//                 {TABS.map(tab => (
//                     <button key={tab.id}
//                         onClick={() => setSearchParams({ tab: tab.id })}
//                         className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
//               ${activeTab === tab.id
//                                 ? 'bg-white text-zinc-900 shadow-sm'
//                                 : 'text-zinc-500 hover:text-zinc-700'}`}>
//                         <i className={`fa-solid ${tab.icon} text-xs`} />
//                         {tab.label}
//                     </button>
//                 ))}
//             </div>

//             {/* Tab content */}
//             {activeTab === 'profile' && (
//                 <ProfileTab user={user} onUserUpdate={setUser} />
//             )}
//             {activeTab === 'orders' && (
//                 <OrdersTab />
//             )}

//             <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
//         </div>
//     );
// };

// export default Account;




// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import Swal from 'sweetalert2';

// const API = 'http://localhost:3001';

// const authHeaders = () => ({
//     'Content-Type': 'application/json',
//     'auth-token': localStorage.getItem('auth-token') || '',
// });

// const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
// const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
// const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

// /* ── Status helpers ── */
// const STATUS_STYLES = {
//     placed: 'bg-blue-50    text-blue-600    border-blue-100',
//     confirmed: 'bg-cyan-50    text-cyan-600    border-cyan-100',
//     shipped: 'bg-amber-50   text-amber-600   border-amber-100',
//     delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
//     cancelled: 'bg-rose-50    text-rose-500    border-rose-100',
// };
// const STATUS_ICONS = {
//     placed: 'fa-receipt', confirmed: 'fa-circle-check',
//     shipped: 'fa-truck-fast', delivered: 'fa-box-open', cancelled: 'fa-ban',
// };
// const StatusBadge = ({ status }) => (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${STATUS_STYLES[status] ?? STATUS_STYLES.placed}`}>
//         <i className={`fa-solid ${STATUS_ICONS[status] ?? 'fa-receipt'} text-[10px]`} />
//         {status}
//     </span>
// );

// /* ── Inline toast ── */
// const InlineToast = ({ msg, type }) => {
//     if (!msg) return null;
//     return (
//         <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium mb-5
//       ${type === 'error'
//                 ? 'bg-rose-50 border-rose-200 text-rose-600'
//                 : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
//             <i className={`fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`} />
//             {msg}
//         </div>
//     );
// };

// /* ── Input + Label ── */
// const Field = ({ label, children, hint }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{label}</label>
//         {children}
//         {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
//     </div>
// );

// const Input = ({ className = '', ...props }) => (
//     <input
//         className={`w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none
//       focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all placeholder-zinc-300 bg-white ${className}`}
//         {...props}
//     />
// );

// /* ─────────────────────────────────────────────────
//    ORDER DETAIL MODAL
// ───────────────────────────────────────────────── */
// const OrderModal = ({ order, onClose }) => {
//     if (!order) return null;
//     const { orderId, items, shipping, payment, pricing, status, placedAt } = order;
//     const payLabel =
//         payment.method === 'card' ? `Card ····${payment.last4}` :
//             payment.method === 'upi' ? `UPI: ${payment.upiId}` : 'Cash on Delivery';

//     return (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//             <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
//                 onClick={e => e.stopPropagation()}>

//                 {/* Header */}
//                 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
//                     <div>
//                         <p className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             Order Details
//                         </p>
//                         <p className="text-xs text-zinc-400 font-mono mt-0.5">{orderId}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <StatusBadge status={status} />
//                         <button onClick={onClose}
//                             className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
//                             <i className="fa-solid fa-xmark text-zinc-500 text-sm" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Body */}
//                 <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

//                     {/* Delivery banner */}
//                     <div className="px-4 py-3.5 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
//                             <i className="fa-solid fa-truck-fast text-white" />
//                         </div>
//                         <div>
//                             <p className="text-white/70 text-[11px] uppercase tracking-wide font-medium">Estimated Delivery</p>
//                             <p className="text-white text-sm font-bold">
//                                 {fmtDate(addDays(placedAt, 3))} – {fmtDate(addDays(placedAt, 6))}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Items */}
//                     <div className="rounded-2xl border border-zinc-100 overflow-hidden">
//                         <p className="px-4 py-2.5 bg-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">Items</p>
//                         <div className="divide-y divide-zinc-100">
//                             {items.map((item, i) => (
//                                 <div key={i} className="flex items-center gap-3 px-4 py-3">
//                                     <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
//                                         <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
//                                     </div>
//                                     <p className="text-sm font-bold text-zinc-900 shrink-0">₹{fmt(item.price * item.quantity)}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Shipping */}
//                     <div className="rounded-2xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Deliver To</p>
//                         <p className="text-sm font-semibold text-zinc-800">{shipping.fullName}</p>
//                         <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
//                             {shipping.address}{shipping.landmark ? ', ' + shipping.landmark : ''}, {shipping.city}, {shipping.state} – {shipping.pincode}
//                         </p>
//                         <p className="text-xs text-zinc-500">{shipping.phone}</p>
//                     </div>

//                     {/* Pricing */}
//                     <div className="rounded-2xl border border-zinc-100 p-4 flex flex-col gap-2 text-sm">
//                         <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>₹{fmt(pricing.subtotal)}</span></div>
//                         {pricing.discountAmt > 0 && (
//                             <div className="flex justify-between text-emerald-600">
//                                 <span>Promo ({pricing.promoCode?.toUpperCase()})</span>
//                                 <span>−₹{fmt(pricing.discountAmt)}</span>
//                             </div>
//                         )}
//                         <div className="flex justify-between text-zinc-500">
//                             <span>Shipping</span>
//                             <span className={pricing.shippingFee === 0 ? 'text-emerald-600' : ''}>
//                                 {pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}
//                             </span>
//                         </div>
//                         <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base">
//                             <span>Total</span><span>₹{fmt(pricing.total)}</span>
//                         </div>
//                     </div>

//                     {/* Payment */}
//                     <div className="rounded-2xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Payment</p>
//                         <p className="text-sm font-semibold text-zinc-800">{payLabel}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// /* ─────────────────────────────────────────────────
//    PROFILE TAB
// ───────────────────────────────────────────────── */
// const ProfileTab = ({ user, onUserUpdate }) => {
//     const [name, setName] = useState(user?.name || '');
//     const [phone, setPhone] = useState(user?.phone || '');
//     const [saving, setSaving] = useState(false);
//     const [toast, setToast] = useState({ msg: '', type: '' });

//     const [curPwd, setCurPwd] = useState('');
//     const [newPwd, setNewPwd] = useState('');
//     const [confPwd, setConfPwd] = useState('');
//     const [pwdSaving, setPwdSaving] = useState(false);
//     const [showPwd, setShowPwd] = useState(false);
//     const [pwdToast, setPwdToast] = useState({ msg: '', type: '' });

//     const flash = (msg, type = 'success', setter = setToast) => {
//         setter({ msg, type });
//         setTimeout(() => setter({ msg: '', type: '' }), 3500);
//     };

//     const handleSave = async () => {
//         if (!name.trim()) { flash('Name cannot be empty.', 'error'); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${API}/account/update`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, phone }) });
//             const data = await res.json();
//             data.success ? (onUserUpdate(data.user), flash('Profile updated!')) : flash(data.error || 'Update failed.', 'error');
//         } catch { flash('Network error.', 'error'); }
//         setSaving(false);
//     };

//     const handleChangePwd = async () => {
//         if (!curPwd || !newPwd || !confPwd) { flash('All fields are required.', 'error', setPwdToast); return; }
//         if (newPwd !== confPwd) { flash('Passwords do not match.', 'error', setPwdToast); return; }
//         if (newPwd.length < 6) { flash('Min. 6 characters.', 'error', setPwdToast); return; }
//         setPwdSaving(true);
//         try {
//             const res = await fetch(`${API}/account/changepassword`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }) });
//             const data = await res.json();
//             if (data.success) { flash('Password changed!', 'success', setPwdToast); setCurPwd(''); setNewPwd(''); setConfPwd(''); }
//             else flash(data.error || 'Failed.', 'error', setPwdToast);
//         } catch { flash('Network error.', 'error', setPwdToast); }
//         setPwdSaving(false);
//     };

//     const avatar = (user?.name || '?')[0].toUpperCase();
//     const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

//     return (
//         <div className="flex flex-col gap-6 max-w-2xl">

//             {/* Hero card */}
//             <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] p-6">
//                 {/* Blobs */}
//                 <div className="pointer-events-none absolute inset-0">
//                     <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-rose-600/20 blur-[60px]" />
//                     <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-amber-400/15 blur-[60px]" />
//                 </div>
//                 <div className="relative flex items-center gap-5">
//                     {/* Avatar */}
//                     <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-500/30 shrink-0"
//                         style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                         {initials}
//                     </div>
//                     <div>
//                         <p className="text-white font-black text-xl leading-tight"
//                             style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             {user?.name || 'Your Name'}
//                         </p>
//                         <p className="text-zinc-400 text-sm mt-0.5">{user?.email}</p>
//                         <div className="flex items-center gap-1.5 mt-2">
//                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                             <span className="text-zinc-500 text-[11px]">
//                                 Member since {user?.date ? fmtDate(user.date) : '—'}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Personal details */}
//             <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-zinc-100">
//                     <h3 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                         Personal Details
//                     </h3>
//                 </div>
//                 <div className="p-6 flex flex-col gap-4">
//                     <InlineToast msg={toast.msg} type={toast.type} />
//                     <Field label="Full Name">
//                         <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
//                     </Field>
//                     <Field label="Email Address" hint="Email cannot be changed.">
//                         <Input value={user?.email || ''} disabled className="bg-zinc-50 cursor-not-allowed text-zinc-400" />
//                     </Field>
//                     <Field label="Phone Number">
//                         <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
//                     </Field>
//                     <button onClick={handleSave} disabled={saving}
//                         className="flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-60 mt-1">
//                         {saving
//                             ? <><i className="fa-solid fa-circle-notch fa-spin" /> Saving…</>
//                             : <><i className="fa-solid fa-floppy-disk text-xs" /> Save Changes</>}
//                     </button>
//                 </div>
//             </div>

//             {/* Change password */}
//             <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-zinc-100">
//                     <h3 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                         Change Password
//                     </h3>
//                 </div>
//                 <div className="p-6 flex flex-col gap-4">
//                     <InlineToast msg={pwdToast.msg} type={pwdToast.type} />
//                     {[
//                         { label: 'Current Password', val: curPwd, setter: setCurPwd, ph: '••••••••' },
//                         { label: 'New Password', val: newPwd, setter: setNewPwd, ph: 'Min. 6 characters' },
//                         { label: 'Confirm Password', val: confPwd, setter: setConfPwd, ph: 'Repeat new password' },
//                     ].map(({ label, val, setter, ph }) => (
//                         <Field key={label} label={label}>
//                             <Input type={showPwd ? 'text' : 'password'} value={val} onChange={e => setter(e.target.value)} placeholder={ph} />
//                         </Field>
//                     ))}
//                     <label className="flex items-center gap-2 cursor-pointer select-none">
//                         <input type="checkbox" checked={showPwd} onChange={e => setShowPwd(e.target.checked)} className="accent-zinc-900 w-3.5 h-3.5" />
//                         <span className="text-xs text-zinc-500 font-medium">Show passwords</span>
//                     </label>
//                     <button onClick={handleChangePwd} disabled={pwdSaving}
//                         className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-zinc-900 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-60">
//                         {pwdSaving
//                             ? <><i className="fa-solid fa-circle-notch fa-spin" /> Updating…</>
//                             : <><i className="fa-solid fa-lock text-xs" /> Update Password</>}
//                     </button>
//                 </div>
//             </div>

//             {/* Quick stats row */}
//             <div className="grid grid-cols-3 gap-3">
//                 {[
//                     { icon: 'fa-bag-shopping', label: 'Orders', val: user?.orderCount ?? '—' },
//                     { icon: 'fa-heart', label: 'Wishlist', val: user?.wishlist ?? '—' },
//                     { icon: 'fa-tag', label: 'Promo Used', val: user?.promoUsed ?? '—' },
//                 ].map(({ icon, label, val }) => (
//                     <div key={label} className="bg-white rounded-2xl border border-zinc-100 p-4 flex flex-col items-center gap-1.5 text-center">
//                         <i className={`fa-solid ${icon} text-zinc-300 text-lg`} />
//                         <p className="text-lg font-black text-zinc-900">{val}</p>
//                         <p className="text-[11px] text-zinc-400 font-medium">{label}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// /* ─────────────────────────────────────────────────
//    ORDERS TAB
// ───────────────────────────────────────────────── */
// const OrdersTab = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selected, setSelected] = useState(null);
//     const [filter, setFilter] = useState('all');

//     useEffect(() => {
//         fetch(`${API}/orders/myorders`, { headers: authHeaders() })
//             .then(r => r.json())
//             .then(data => data.success ? setOrders(data.orders) : setError(data.error || 'Failed to load.'))
//             .catch(() => setError('Network error.'))
//             .finally(() => setLoading(false));
//     }, []);

//     const STATUS_FILTERS = ['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

//     if (loading) return (
//         <div className="flex flex-col gap-4">
//             {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-zinc-100 animate-pulse" />)}
//         </div>
//     );

//     if (error) return (
//         <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-3">
//             <i className="fa-solid fa-triangle-exclamation" /> {error}
//         </div>
//     );

//     return (
//         <>
//             {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}

//             {/* Filter pills */}
//             {orders.length > 0 && (
//                 <div className="flex gap-2 flex-wrap mb-6">
//                     {STATUS_FILTERS.map(f => (
//                         <button key={f} onClick={() => setFilter(f)}
//                             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border
//                 ${filter === f
//                                     ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
//                                     : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>
//                             {f}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Empty state */}
//             {orders.length === 0 && (
//                 <div className="flex flex-col items-center text-center py-20 gap-4">
//                     <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center">
//                         <i className="fa-solid fa-bag-shopping text-zinc-300 text-2xl" />
//                     </div>
//                     <p className="text-zinc-900 font-black text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                         No orders yet
//                     </p>
//                     <p className="text-zinc-400 text-sm max-w-xs">When you place your first order it will show up here.</p>
//                     <Link to="/">
//                         <button className="mt-2 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/20 transition-all">
//                             Start Shopping
//                         </button>
//                     </Link>
//                 </div>
//             )}

//             {/* No results for filter */}
//             {orders.length > 0 && filtered.length === 0 && (
//                 <div className="py-10 text-center text-zinc-400 text-sm">No {filter} orders found.</div>
//             )}

//             {/* Order cards */}
//             <div className="flex flex-col gap-3">
//                 {filtered.map(order => {
//                     const first = order.items[0];
//                     const more = order.items.length - 1;
//                     return (
//                         <button key={order._id} onClick={() => setSelected(order)}
//                             className="w-full text-left bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 overflow-hidden group">
//                             <div className="flex items-stretch">
//                                 {/* Thumb */}
//                                 <div className="w-20 shrink-0 bg-[#f5f3f0] flex items-center justify-center p-3 border-r border-zinc-100">
//                                     <img src={first?.image} alt={first?.name} className="w-14 h-14 object-cover rounded-xl" />
//                                 </div>
//                                 {/* Info */}
//                                 <div className="flex-1 min-w-0 px-4 py-4">
//                                     <div className="flex items-start justify-between gap-2 flex-wrap">
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-black text-zinc-900 truncate"
//                                                 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                                                 {first?.name}{more > 0 ? ` +${more} more` : ''}
//                                             </p>
//                                             <p className="text-xs text-zinc-400 font-mono mt-0.5">{order.orderId}</p>
//                                         </div>
//                                         <StatusBadge status={order.status} />
//                                     </div>
//                                     <div className="flex items-center justify-between mt-3">
//                                         <div className="flex items-center gap-3 text-xs text-zinc-400">
//                                             <span><i className="fa-regular fa-calendar mr-1" />{fmtDate(order.placedAt)}</span>
//                                             <span><i className="fa-solid fa-box mr-1" />{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <p className="text-sm font-black text-zinc-900">₹{fmt(order.pricing.total)}</p>
//                                             <i className="fa-solid fa-chevron-right text-zinc-300 text-xs group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>
//         </>
//     );
// };

// /* ─────────────────────────────────────────────────
//    MAIN ACCOUNT PAGE
// ───────────────────────────────────────────────── */
// const TABS = [
//     { id: 'profile', label: 'Profile', icon: 'fa-user' },
//     { id: 'orders', label: 'My Orders', icon: 'fa-bag-shopping' },
// ];

// const Account = () => {
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const activeTab = searchParams.get('tab') || 'profile';

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem('auth-token');
//         if (!token) { navigate('/login'); return; }

//         fetch(`${API}/account/profile`, { headers: authHeaders() })
//             .then(r => r.json())
//             .then(data => { data.success ? setUser(data.user) : navigate('/login'); })
//             .catch(() => navigate('/login'))
//             .finally(() => setLoading(false));
//     }, [navigate]);

//     const handleLogout = () => {
//         Swal.fire({
//             title: 'Logging out?',
//             text: 'You will need to sign in again.',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Logout',
//             confirmButtonColor: '#ef4444',
//             cancelButtonText: 'Cancel',
//         }).then(({ isConfirmed }) => {
//             if (isConfirmed) {
//                 localStorage.removeItem('auth-token');
//                 navigate('/');
//                 window.location.reload();
//             }
//         });
//     };

//     if (loading) return (
//         <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 animate-pulse">
//             <div className="h-10 w-48 bg-zinc-200 rounded-xl mb-8" />
//             <div className="h-64 bg-zinc-100 rounded-3xl" />
//         </div>
//     );

//     const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

//     return (
//         <div className="min-h-screen bg-[#faf7f4]">

//             {/* ── Page hero banner ── */}
//             <div className="overflow-hidden bg-[#191919] pb-20">
//                 {/* <div className="pointer-events-none absolute inset-0">
//                     <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-rose-600/20 blur-[80px]" />
//                     <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-400/10 blur-[80px]" />
//                     <div className="absolute inset-0 opacity-[0.03]"
//                         style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
//                 </div> */}
//                 <div className="relative max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 pt-10 pb-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-rose-500/30 shrink-0"
//                                 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                                 {initials}
//                             </div>
//                             <div>
//                                 <p className="text-white/60 text-xs tracking-widest uppercase font-medium">Welcome back</p>
//                                 <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight"
//                                     style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                                     {user?.name || 'Your Account'}
//                                 </h1>
//                                 <p className="text-zinc-500 text-xs mt-0.5">{user?.email}</p>
//                             </div>
//                         </div>
//                         <button onClick={handleLogout}
//                             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/40 transition-all">
//                             <i className="fa-solid fa-right-from-bracket" />
//                             <span className="hidden sm:block">Logout</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ── Tabs (overlapping the banner) ── */}
//             <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 -mt-10 z-99">
//                 <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-lg shadow-zinc-200/60 border border-zinc-100 w-fit">
//                     {TABS.map(tab => (
//                         <button key={tab.id} onClick={() => setSearchParams({ tab: tab.id })}
//                             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
//                 ${activeTab === tab.id
//                                     ? 'bg-zinc-900 text-white shadow-sm'
//                                     : 'text-zinc-500 hover:text-zinc-800'}`}>
//                             <i className={`fa-solid ${tab.icon} text-xs`} />
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* ── Content ── */}
//             <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-8 pb-20">
//                 {activeTab === 'profile' && <ProfileTab user={user} onUserUpdate={setUser} />}
//                 {activeTab === 'orders' && <OrdersTab />}
//             </div>

//             <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
//         </div>
//     );
// };

// export default Account;













import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Swal from 'sweetalert2';
import { api_paths, localpath } from '../config/apis';

const API = localpath;

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'auth-token': localStorage.getItem('auth-token') || '',
});

const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

/* ── Status helpers ── */
const STATUS_STYLES = {
    placed: 'bg-blue-50    text-blue-600    border-blue-100',
    confirmed: 'bg-cyan-50    text-cyan-600    border-cyan-100',
    shipped: 'bg-amber-50   text-amber-600   border-amber-100',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-rose-50    text-rose-500    border-rose-100',
};
const STATUS_ICONS = {
    placed: 'fa-receipt', confirmed: 'fa-circle-check',
    shipped: 'fa-truck-fast', delivered: 'fa-box-open', cancelled: 'fa-ban',
};
const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${STATUS_STYLES[status] ?? STATUS_STYLES.placed}`}>
        <i className={`fa-solid ${STATUS_ICONS[status] ?? 'fa-receipt'} text-[10px]`} />
        {status}
    </span>
);

/* ── Inline toast ── */
const InlineToast = ({ msg, type }) => {
    if (!msg) return null;
    return (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium mb-5
      ${type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
            <i className={`fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`} />
            {msg}
        </div>
    );
};

/* ── Input + Label ── */
const Field = ({ label, children, hint }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
    </div>
);

const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none
      focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all placeholder-zinc-300 bg-white ${className}`}
        {...props}
    />
);

/* ─────────────────────────────────────────────────
   ORDER DETAIL MODAL
───────────────────────────────────────────────── */
// const OrderModal = ({ order, onClose }) => {
//     if (!order) return null;
//     const { orderId, items, shipping, payment, pricing, status, placedAt } = order;
//     const payLabel =
//         payment.method === 'card' ? `Card ····${payment.last4}` :
//             payment.method === 'upi' ? `UPI: ${payment.upiId}` : 'Cash on Delivery';

//     return (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//             <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
//                 onClick={e => e.stopPropagation()}>

//                 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
//                     <div>
//                         <p className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             Order Details
//                         </p>
//                         <p className="text-xs text-zinc-400 font-mono mt-0.5">{orderId}</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <StatusBadge status={status} />
//                         <button onClick={onClose}
//                             className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
//                             <i className="fa-solid fa-xmark text-zinc-500 text-sm" />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
//                     <div className="px-4 py-3.5 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
//                             <i className="fa-solid fa-truck-fast text-white" />
//                         </div>
//                         <div>
//                             <p className="text-white/70 text-[11px] uppercase tracking-wide font-medium">Estimated Delivery</p>
//                             <p className="text-white text-sm font-bold">
//                                 {fmtDate(addDays(placedAt, 3))} – {fmtDate(addDays(placedAt, 6))}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="rounded-2xl border border-zinc-100 overflow-hidden">
//                         <p className="px-4 py-2.5 bg-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">Items</p>
//                         <div className="divide-y divide-zinc-100">
//                             {items.map((item, i) => (
//                                 <div key={i} className="flex items-center gap-3 px-4 py-3">
//                                     <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
//                                         <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
//                                     </div>
//                                     <p className="text-sm font-bold text-zinc-900 shrink-0">₹{fmt(item.price * item.quantity)}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="rounded-2xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Deliver To</p>
//                         <p className="text-sm font-semibold text-zinc-800">{shipping.fullName}</p>
//                         <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
//                             {shipping.address}{shipping.landmark ? ', ' + shipping.landmark : ''}, {shipping.city}, {shipping.state} – {shipping.pincode}
//                         </p>
//                         <p className="text-xs text-zinc-500">{shipping.phone}</p>
//                     </div>

//                     <div className="rounded-2xl border border-zinc-100 p-4 flex flex-col gap-2 text-sm">
//                         <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>₹{fmt(pricing.subtotal)}</span></div>
//                         {pricing.discountAmt > 0 && (
//                             <div className="flex justify-between text-emerald-600">
//                                 <span>Promo ({pricing.promoCode?.toUpperCase()})</span>
//                                 <span>−₹{fmt(pricing.discountAmt)}</span>
//                             </div>
//                         )}
//                         <div className="flex justify-between text-zinc-500">
//                             <span>Shipping</span>
//                             <span className={pricing.shippingFee === 0 ? 'text-emerald-600' : ''}>
//                                 {pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}
//                             </span>
//                         </div>
//                         <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base">
//                             <span>Total</span><span>₹{fmt(pricing.total)}</span>
//                         </div>
//                     </div>

//                     <div className="rounded-2xl border border-zinc-100 p-4">
//                         <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Payment</p>
//                         <p className="text-sm font-semibold text-zinc-800">{payLabel}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
    const { orderId, items, shipping, payment, pricing, status, placedAt } = order;
    const payLabel = payment.method === 'card' ? `Card ····${payment.last4}` : payment.method === 'upi' ? `UPI: ${payment.upiId}` : 'Cash on Delivery';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
                    <div>
                        <p className="font-black text-zinc-900 text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Order Details</p>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{orderId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                            <i className="fa-solid fa-xmark text-zinc-500 text-sm" />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto scrollbar-thin flex-1 px-6 py-5 flex flex-col gap-5">

                    {/* Delivery estimate */}
                    <div className="px-4 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center gap-3">
                        <i className="fa-solid fa-truck-fast text-white" />
                        <div>
                            <p className="text-white/70 text-[11px] uppercase tracking-wide font-medium">Estimated Delivery</p>
                            <p className="text-white text-sm font-bold">
                                {fmtDate(addDays(placedAt, 3))} – {fmtDate(addDays(placedAt, 6))}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    {/* <div className="rounded-xl border border-zinc-100 overflow-hidden">
                        <p className="px-4 py-2.5 bg-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">Items</p>
                        <div className="divide-y divide-zinc-100">
                            {items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900 shrink-0">₹{fmt(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div className="rounded-2xl border border-zinc-100 ">
                        <p className="px-4 py-2.5 bg-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">Items</p>
                        <div className="divide-y divide-zinc-100">
                            {items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900 shrink-0">₹{fmt(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-xl border border-zinc-100 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Deliver To</p>
                        <p className="text-sm font-semibold text-zinc-800">{shipping.firstName} {shipping.lastName}</p>
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                            {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''}, {shipping.city}, {shipping.state} – {shipping.pin}
                        </p>
                        <p className="text-xs text-zinc-500">{shipping.phone}</p>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-xl border border-zinc-100 p-4 flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>₹{fmt(pricing.subtotal)}</span></div>
                        {pricing.discountAmt > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>Promo ({pricing.promoCode?.toUpperCase()}) – {Math.round(pricing.discount * 100)}% off</span>
                                <span>−₹{fmt(pricing.discountAmt)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-zinc-500">
                            <span>Shipping</span>
                            <span className={pricing.shippingFee === 0 ? 'text-emerald-600' : ''}>{pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}</span>
                        </div>
                        <div className="border-t border-zinc-100 pt-2 flex justify-between font-black text-zinc-900 text-base">
                            <span>Total</span><span>₹{fmt(pricing.total)}</span>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-xl border border-zinc-100 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Payment</p>
                        <p className="text-sm font-semibold text-zinc-800">{payLabel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   PROFILE TAB
───────────────────────────────────────────────── */
const ProfileTab = ({ user, onUserUpdate }) => {
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ msg: '', type: '' });

    const [curPwd, setCurPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confPwd, setConfPwd] = useState('');
    const [pwdSaving, setPwdSaving] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [pwdToast, setPwdToast] = useState({ msg: '', type: '' });

    // Mode States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPwd, setIsChangingPwd] = useState(false);

    const flash = (msg, type = 'success', setter = setToast) => {
        setter({ msg, type });
        setTimeout(() => setter({ msg: '', type: '' }), 3500);
    };

    const handleSave = async () => {
        if (!name.trim()) { flash('Name cannot be empty.', 'error'); return; }
        setSaving(true);
        try {
            const res = await fetch(api_paths.accountUpdate, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, phone }) });
            const data = await res.json();
            if (data.success) {
                onUserUpdate(data.user);
                flash('Profile updated!');
                setIsEditingProfile(false); // Edit mode band kardo update ke baad
            } else {
                flash(data.error || 'Update failed.', 'error');
            }
        } catch { flash('Network error.', 'error'); }
        setSaving(false);
    };

    const handleChangePwd = async () => {
        if (!curPwd || !newPwd || !confPwd) { flash('All fields are required.', 'error', setPwdToast); return; }
        if (newPwd !== confPwd) { flash('Passwords do not match.', 'error', setPwdToast); return; }
        if (newPwd.length < 6) { flash('Min. 6 characters.', 'error', setPwdToast); return; }
        setPwdSaving(true);
        try {
            const res = await fetch(api_paths.changePassword, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }) });
            const data = await res.json();
            if (data.success) {
                flash('Password changed successfully!', 'success', setPwdToast);
                setCurPwd(''); setNewPwd(''); setConfPwd('');
                setTimeout(() => setIsChangingPwd(false), 2000); // 2 sec baad form band kar do
            } else {
                flash(data.error || 'Failed.', 'error', setPwdToast);
            }
        } catch { flash('Network error.', 'error', setPwdToast); }
        setPwdSaving(false);
    };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (
        <div className="flex flex-col gap-6 max-w-2xl">

            {/* Hero card */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] p-6">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-rose-600/20 blur-[60px]" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-amber-400/15 blur-[60px]" />
                </div>
                <div className="relative flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-500/30 shrink-0"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {initials}
                    </div>
                    <div>
                        <p className="text-white font-black text-xl leading-tight"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {user?.name || 'Your Name'}
                        </p>
                        <p className="text-zinc-400 text-sm mt-0.5">{user?.email}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-zinc-500 text-[11px]">
                                Member since {user?.date ? fmtDate(user.date) : '—'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal details (View & Edit Mode) */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Personal Details
                    </h3>
                    {!isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100"
                        >
                            <i className="fa-solid fa-pen-to-square" /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="p-6">
                    <InlineToast msg={toast.msg} type={toast.type} />

                    {isEditingProfile ? (
                        // Edit Mode
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            <Field label="Full Name">
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                            </Field>
                            <Field label="Email Address" hint="Email cannot be changed.">
                                <Input value={user?.email || ''} disabled className="bg-zinc-50 cursor-not-allowed text-zinc-400" />
                            </Field>
                            <Field label="Phone Number">
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
                            </Field>
                            <div className="flex gap-3 mt-2">
                                <button onClick={() => setIsEditingProfile(false)} disabled={saving}
                                    className="flex-1 py-3.5 border border-zinc-200 text-zinc-600 text-sm font-bold rounded-xl hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-60">
                                    {saving ? <><i className="fa-solid fa-circle-notch fa-spin" /> Saving…</> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Read Only Mode
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-zinc-800">{user?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Email Address</p>
                                <p className="text-sm font-semibold text-zinc-800">{user?.email || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Phone Number</p>
                                <p className="text-sm font-semibold text-zinc-800">{user?.phone || '—'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Security / Change Password */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                {!isChangingPwd ? (
                    <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h3 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Account Security</h3>
                            <p className="text-xs text-zinc-500 mt-1">Manage your password to secure your account.</p>
                        </div>
                        <button
                            onClick={() => setIsChangingPwd(true)}
                            className="px-5 py-2.5 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-lock" /> Change Password
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                            <h3 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Update Password
                            </h3>
                            <button onClick={() => setIsChangingPwd(false)} className="text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors">
                                Cancel
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4 animate-in fade-in duration-300">
                            <InlineToast msg={pwdToast.msg} type={pwdToast.type} />
                            {[
                                { label: 'Current Password', val: curPwd, setter: setCurPwd, ph: '••••••••' },
                                { label: 'New Password', val: newPwd, setter: setNewPwd, ph: 'Min. 6 characters' },
                                { label: 'Confirm Password', val: confPwd, setter: setConfPwd, ph: 'Repeat new password' },
                            ].map(({ label, val, setter, ph }) => (
                                <Field key={label} label={label}>
                                    <Input type={showPwd ? 'text' : 'password'} value={val} onChange={e => setter(e.target.value)} placeholder={ph} />
                                </Field>
                            ))}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={showPwd} onChange={e => setShowPwd(e.target.checked)} className="accent-zinc-900 w-3.5 h-3.5" />
                                <span className="text-xs text-zinc-500 font-medium">Show passwords</span>
                            </label>
                            <button onClick={handleChangePwd} disabled={pwdSaving}
                                className="mt-2 flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-60">
                                {pwdSaving
                                    ? <><i className="fa-solid fa-circle-notch fa-spin" /> Updating…</>
                                    : 'Update Password'}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: 'fa-bag-shopping', label: 'Orders', val: user?.orderCount ?? '—' },
                    { icon: 'fa-heart', label: 'Wishlist', val: user?.wishlist ?? '—' },
                    { icon: 'fa-tag', label: 'Promo Used', val: user?.promoUsed ?? '—' },
                ].map(({ icon, label, val }) => (
                    <div key={label} className="bg-white rounded-2xl border border-zinc-100 p-4 flex flex-col items-center gap-1.5 text-center">
                        <i className={`fa-solid ${icon} text-zinc-300 text-lg`} />
                        <p className="text-lg font-black text-zinc-900">{val}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   ORDERS TAB
───────────────────────────────────────────────── */
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch(`${API}/orders/myorders`, { headers: authHeaders() })
            .then(r => r.json())
            .then(data => data.success ? setOrders(data.orders) : setError(data.error || 'Failed to load.'))
            .catch(() => setError('Network error.'))
            .finally(() => setLoading(false));
    }, []);

    const STATUS_FILTERS = ['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    if (loading) return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-zinc-100 animate-pulse" />)}
        </div>
    );

    if (error) return (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation" /> {error}
        </div>
    );

    return (
        <>
            {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}

            {orders.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-6">
                    {STATUS_FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border
                ${filter === f
                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {orders.length === 0 && (
                <div className="flex flex-col items-center text-center py-20 gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center">
                        <i className="fa-solid fa-bag-shopping text-zinc-300 text-2xl" />
                    </div>
                    <p className="text-zinc-900 font-black text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        No orders yet
                    </p>
                    <p className="text-zinc-400 text-sm max-w-xs">When you place your first order it will show up here.</p>
                    <Link to="/">
                        <button className="mt-2 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/20 transition-all">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            )}

            {orders.length > 0 && filtered.length === 0 && (
                <div className="py-10 text-center text-zinc-400 text-sm">No {filter} orders found.</div>
            )}

            <div className="flex flex-col gap-3">
                {filtered.map(order => {
                    const first = order.items[0];
                    const more = order.items.length - 1;
                    return (
                        <button key={order._id} onClick={() => setSelected(order)}
                            className="w-full text-left bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 overflow-hidden group">
                            <div className="flex items-stretch">
                                <div className="w-20 shrink-0 bg-[#f5f3f0] flex items-center justify-center p-3 border-r border-zinc-100">
                                    <img src={first?.image} alt={first?.name} className="w-14 h-14 object-cover rounded-xl" />
                                </div>
                                <div className="flex-1 min-w-0 px-4 py-4">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-zinc-900 truncate"
                                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                {first?.name}{more > 0 ? ` +${more} more` : ''}
                                            </p>
                                            <p className="text-xs text-zinc-400 font-mono mt-0.5">{order.orderId}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                                            <span><i className="fa-regular fa-calendar mr-1" />{fmtDate(order.placedAt)}</span>
                                            <span><i className="fa-solid fa-box mr-1" />{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-zinc-900">₹{fmt(order.pricing.total)}</p>
                                            <i className="fa-solid fa-chevron-right text-zinc-300 text-xs group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────
   MAIN ACCOUNT PAGE
───────────────────────────────────────────────── */
const TABS = [
    { id: 'profile', label: 'Profile', icon: 'fa-user' },
    { id: 'orders', label: 'My Orders', icon: 'fa-bag-shopping' },
];

const Account = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const token = localStorage.getItem('auth-token');
    //     if (!token) { navigate('/login'); return; }

    //     fetch(`${API}/account/profile`, { headers: authHeaders() })
    //         .then(r => r.json())
    //         .then(data => { data.success ? setUser(data.user) : navigate('/login'); })
    //         .catch(() => navigate('/login'))
    //         .finally(() => setLoading(false));
    // }, [navigate]);

    const { user, setUser, isloading } = useContext(ShopContext);

    // ✅ CHANGE 2: Jab loading khatam ho jaye aur user na mile, tab login par bhejo.
    useEffect(() => {
        if (!isloading && !user && !localStorage.getItem('auth-token')) {
            navigate('/login');
        }
    }, [isloading, user, navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Logging out?',
            text: 'You will need to sign in again.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'Cancel',
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                localStorage.removeItem('auth-token');
                navigate('/');
                window.location.reload();
            }
        });
    };

    if (isloading) return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 animate-pulse">
            <div className="h-10 w-48 bg-zinc-200 rounded-xl mb-8" />
            <div className="h-64 bg-zinc-100 rounded-3xl" />
        </div>
    );

    if (!user) return null;

    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-[#faf7f4]">

            <div className="overflow-hidden bg-[#191919] pb-20">
                <div className="relative max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 pt-10 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-serif font-black shadow-lg shadow-rose-500/30 shrink-0" >
                                {initials}
                            </div>
                            <div>
                                <p className="text-white/60 text-xs tracking-widest uppercase font-medium">Welcome back</p>
                                <h1 className="text-white font-black font-serif text-2xl sm:text-3xl leading-tight" >
                                    {user?.name || 'Your Account'}
                                </h1>
                                <p className="text-gray-300 text-xs mt-0.5">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/40 transition-all">
                            <i className="fa-solid fa-right-from-bracket" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 -mt-10 z-99">
                <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-lg shadow-zinc-200/60 border border-zinc-100 w-fit">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setSearchParams({ tab: tab.id })}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-[13px] font-bold transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-zinc-900 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-800'}`}
                        >
                            <i className={`fa-solid ${tab.icon} text-xs`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-8 pb-20">
                {activeTab === 'profile' && <ProfileTab user={user} onUserUpdate={setUser} />}
                {activeTab === 'orders' && <OrdersTab />}
            </div>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
        </div>
    );
};

export default Account;







