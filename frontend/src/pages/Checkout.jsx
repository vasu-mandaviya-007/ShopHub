// import React, { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';

// const Checkout = () => {
//     const { all_product, cartItem, RemoveFromCart } = useContext(ShopContext);
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         firstName: '', lastName: '', email: '',
//         address: '', city: '', state: '', zip: '',
//         paymentMethod: 'card' // 'card' or 'cod'
//     });

//     // Calculate totals (Same logic as Cart)
//     const cartEntries = all_product
//         .map(product => {
//             const item = cartItem?.find(p => Number(p.productId) === product.id);
//             return item ? { product, cartItem: item } : null;
//         })
//         .filter(Boolean);

//     const subtotal = cartEntries.reduce((sum, { product, cartItem }) => sum + product.new_price * cartItem.quantity, 0);
//     const shippingFee = subtotal >= 999 ? 0 : 99; // Assuming 999 is threshold
//     const total = subtotal + shippingFee;

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handlePlaceOrder = (e) => {
//         e.preventDefault();

//         // Yahan backend API call aayegi (e.g., Stripe session create karna ya database me order save karna)
//         console.log("Order Data Payload: ", { items: cartEntries, total, shippingDetails: formData });

//         // Order success hone par success page par bhejna
//         navigate('/order-success');
//     };

//     if (cartEntries.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
//                 <h2 className="text-2xl font-bold text-zinc-800">No items to checkout</h2>
//                 <button onClick={() => navigate('/')} className="px-6 py-2 bg-zinc-900 text-white rounded-lg">Go to Shop</button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-16 flex flex-col lg:flex-row gap-10">

//             {/* LEFT: Checkout Form */}
//             <div className="flex-1">
//                 <h1 className="text-3xl font-black text-zinc-900 mb-6 font-serif">Checkout</h1>

//                 <form onSubmit={handlePlaceOrder} className="space-y-8">
//                     {/* Shipping Details */}
//                     <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
//                         <h2 className="text-xl font-bold text-zinc-800 mb-4 border-b pb-2">Shipping Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <input required type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400" />
//                             <input required type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400" />
//                             <input required type="email" name="email" placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400 md:col-span-2" />
//                             <input required type="text" name="address" placeholder="Full Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400 md:col-span-2" />
//                             <input required type="text" name="city" placeholder="City" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400" />
//                             <input required type="text" name="state" placeholder="State" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400" />
//                             <input required type="text" name="zip" placeholder="PIN / ZIP Code" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:border-blue-400 md:col-span-2" />
//                         </div>
//                     </div>

//                     {/* Payment Method */}
//                     <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
//                         <h2 className="text-xl font-bold text-zinc-800 mb-4 border-b pb-2">Payment Method</h2>
//                         <div className="flex flex-col gap-3">
//                             <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-zinc-200'}`}>
//                                 <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-zinc-800">Credit / Debit Card</p>
//                                     <p className="text-xs text-zinc-500">Secured via encrypted payment gateway</p>
//                                 </div>
//                                 <i className="fa-brands fa-cc-visa text-2xl text-zinc-400"></i>
//                                 <i className="fa-brands fa-cc-mastercard text-2xl text-zinc-400"></i>
//                             </label>

//                             <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-zinc-200'}`}>
//                                 <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-zinc-800">Cash on Delivery (COD)</p>
//                                     <p className="text-xs text-zinc-500">Pay when you receive your order</p>
//                                 </div>
//                                 <i className="fa-solid fa-money-bill-wave text-xl text-zinc-400"></i>
//                             </label>
//                         </div>
//                     </div>

//                     <button type="submit" className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
//                         {formData.paymentMethod === 'card' ? 'Pay Now' : 'Place Order'} <i className="fa-solid fa-arrow-right"></i>
//                     </button>
//                 </form>
//             </div>

//             {/* RIGHT: Order Summary */}
//             <div className="lg:w-[400px] shrink-0">
//                 <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 sticky top-24">
//                     <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h2>
//                     <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
//                         {cartEntries.map(({ product, cartItem: ci }, index) => (
//                             <div key={index} className="flex gap-3">
//                                 <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-zinc-200" />
//                                 <div>
//                                     <p className="text-sm font-semibold text-zinc-800 line-clamp-1">{product.name}</p>
//                                     <p className="text-xs text-zinc-500">Qty: {ci.quantity}</p>
//                                     <p className="text-sm font-bold text-zinc-900">₹{(product.new_price * ci.quantity).toLocaleString('en-IN')}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="border-t border-zinc-200 pt-4 space-y-2 text-sm">
//                         <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
//                         <div className="flex justify-between text-zinc-600"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span></div>
//                         <div className="flex justify-between text-lg font-black text-zinc-900 mt-2 pt-2 border-t border-zinc-200">
//                             <span>Total</span>
//                             <span>₹{total.toLocaleString('en-IN')}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Checkout;




// Claude Design

// import React, { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext.jsx';

// // ── Step indicators ──────────────────────────────────────────────────────────
// const STEPS = ['Shipping', 'Payment', 'Review'];

// const StepBar = ({ current }) => (
//     <div className="flex items-center justify-center gap-0 mb-10">
//         {STEPS.map((label, i) => {
//             const done = i < current;
//             const active = i === current;
//             return (
//                 <React.Fragment key={label}>
//                     <div className="flex flex-col items-center gap-1.5">
//                         <div
//                             className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
//                 ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
//                                     : active ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200'
//                                         : 'bg-zinc-100 text-zinc-400'}`}
//                         >
//                             {done ? <i className="fa-solid fa-check text-xs" /> : i + 1}
//                         </div>
//                         <span className={`text-[11px] font-semibold tracking-wide uppercase
//               ${active ? 'text-zinc-900' : done ? 'text-emerald-500' : 'text-zinc-400'}`}>
//                             {label}
//                         </span>
//                     </div>
//                     {i < STEPS.length - 1 && (
//                         <div className={`h-0.5 w-16 sm:w-24 mb-5 mx-1 rounded-full transition-all duration-500
//               ${i < current ? 'bg-emerald-400' : 'bg-zinc-200'}`} />
//                     )}
//                 </React.Fragment>
//             );
//         })}
//     </div>
// );

// // ── Input helper ─────────────────────────────────────────────────────────────
// const Field = ({ label, error, children }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</label>
//         {children}
//         {error && <p className="text-xs text-rose-500"><i className="fa-solid fa-circle-exclamation mr-1" />{error}</p>}
//     </div>
// );

// const Input = ({ className = '', ...props }) => (
//     <input
//         className={`px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none
//       focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all placeholder-zinc-300 ${className}`}
//         {...props}
//     />
// );

// // ── STEP 1 – Shipping ─────────────────────────────────────────────────────────
// const ShippingForm = ({ data, onChange, errors }) => (
//     <div className="flex flex-col gap-5">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <Field label="First Name" error={errors.firstName}>
//                 <Input placeholder="Ravi" value={data.firstName} onChange={e => onChange('firstName', e.target.value)} />
//             </Field>
//             <Field label="Last Name" error={errors.lastName}>
//                 <Input placeholder="Sharma" value={data.lastName} onChange={e => onChange('lastName', e.target.value)} />
//             </Field>
//         </div>
//         <Field label="Email Address" error={errors.email}>
//             <Input type="email" placeholder="ravi@email.com" value={data.email} onChange={e => onChange('email', e.target.value)} />
//         </Field>
//         <Field label="Phone Number" error={errors.phone}>
//             <Input type="tel" placeholder="+91 98765 43210" value={data.phone} onChange={e => onChange('phone', e.target.value)} />
//         </Field>
//         <Field label="Address Line 1" error={errors.address1}>
//             <Input placeholder="House / Flat No., Street" value={data.address1} onChange={e => onChange('address1', e.target.value)} />
//         </Field>
//         <Field label="Address Line 2 (Optional)">
//             <Input placeholder="Area, Landmark" value={data.address2} onChange={e => onChange('address2', e.target.value)} />
//         </Field>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//             <Field label="City" error={errors.city}>
//                 <Input placeholder="Mumbai" value={data.city} onChange={e => onChange('city', e.target.value)} />
//             </Field>
//             <Field label="State" error={errors.state}>
//                 <Input placeholder="Maharashtra" value={data.state} onChange={e => onChange('state', e.target.value)} />
//             </Field>
//             <Field label="PIN Code" error={errors.pin}>
//                 <Input placeholder="400001" value={data.pin} onChange={e => onChange('pin', e.target.value)} maxLength={6} />
//             </Field>
//         </div>
//     </div>
// );

// // ── STEP 2 – Payment ──────────────────────────────────────────────────────────
// const PAYMENT_METHODS = [
//     { id: 'card', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
//     { id: 'upi', label: 'UPI', icon: 'fa-indian-rupee-sign' },
//     { id: 'cod', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
// ];

// const PaymentForm = ({ data, onChange, errors }) => (
//     <div className="flex flex-col gap-6">
//         {/* Method picker */}
//         <div className="flex flex-col gap-3">
//             {PAYMENT_METHODS.map(m => (
//                 <label
//                     key={m.id}
//                     className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
//             ${data.method === m.id
//                             ? 'border-zinc-900 bg-zinc-50 shadow-sm'
//                             : 'border-zinc-200 hover:border-zinc-300'}`}
//                 >
//                     <input
//                         type="radio" name="method" value={m.id}
//                         checked={data.method === m.id}
//                         onChange={() => onChange('method', m.id)}
//                         className="accent-zinc-900"
//                     />
//                     <i className={`fa-solid ${m.icon} text-zinc-500 w-5 text-center`} />
//                     <span className="text-sm font-semibold text-zinc-800">{m.label}</span>
//                 </label>
//             ))}
//         </div>

//         {/* Card fields */}
//         {data.method === 'card' && (
//             <div className="flex flex-col gap-5 p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
//                 <Field label="Name on Card" error={errors.cardName}>
//                     <Input placeholder="RAVI SHARMA" value={data.cardName} onChange={e => onChange('cardName', e.target.value.toUpperCase())} />
//                 </Field>
//                 <Field label="Card Number" error={errors.cardNumber}>
//                     <Input
//                         placeholder="1234 5678 9012 3456"
//                         value={data.cardNumber}
//                         maxLength={19}
//                         onChange={e => {
//                             const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
//                             const fmt = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
//                             onChange('cardNumber', fmt);
//                         }}
//                     />
//                 </Field>
//                 <div className="grid grid-cols-2 gap-5">
//                     <Field label="Expiry (MM/YY)" error={errors.expiry}>
//                         <Input
//                             placeholder="08/27"
//                             value={data.expiry}
//                             maxLength={5}
//                             onChange={e => {
//                                 const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
//                                 const fmt = raw.length > 2 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw;
//                                 onChange('expiry', fmt);
//                             }}
//                         />
//                     </Field>
//                     <Field label="CVV" error={errors.cvv}>
//                         <Input placeholder="•••" type="password" maxLength={4} value={data.cvv} onChange={e => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} />
//                     </Field>
//                 </div>
//             </div>
//         )}

//         {/* UPI field */}
//         {data.method === 'upi' && (
//             <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
//                 <Field label="UPI ID" error={errors.upiId}>
//                     <Input placeholder="yourname@upi" value={data.upiId} onChange={e => onChange('upiId', e.target.value)} />
//                 </Field>
//             </div>
//         )}

//         {/* COD note */}
//         {data.method === 'cod' && (
//             <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
//                 <i className="fa-solid fa-circle-info text-amber-500 mt-0.5" />
//                 <p className="text-xs text-amber-700 leading-relaxed">
//                     Pay in cash when your order is delivered. A nominal handling fee of ₹29 may apply.
//                 </p>
//             </div>
//         )}
//     </div>
// );

// // ── STEP 3 – Review ───────────────────────────────────────────────────────────
// const ReviewStep = ({ shipping, payment, cartEntries, subtotal, shippingFee, discountAmt, total, promoCode, discount }) => (
//     <div className="flex flex-col gap-6">

//         {/* Items */}
//         <div className="rounded-2xl border border-zinc-100 overflow-hidden">
//             <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100">
//                 <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Order Items</p>
//             </div>
//             <div className="divide-y divide-zinc-100">
//                 {cartEntries.map(({ product, cartItem }) => (
//                     <div key={product.id} className="flex items-center gap-4 px-5 py-4">
//                         <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-zinc-100" />
//                         <div className="flex-1 min-w-0">
//                             <p className="text-sm font-semibold text-zinc-800 truncate">{product.name}</p>
//                             {cartItem.size && <p className="text-xs text-zinc-400">Size: {cartItem.size}</p>}
//                             <p className="text-xs text-zinc-400">Qty: {cartItem.quantity}</p>
//                         </div>
//                         <p className="text-sm font-bold text-zinc-900">₹{(product.new_price * cartItem.quantity).toLocaleString('en-IN')}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>

//         {/* Shipping address */}
//         <div className="rounded-2xl border border-zinc-100 p-5">
//             <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Deliver To</p>
//             <p className="text-sm font-semibold text-zinc-800">{shipping.firstName} {shipping.lastName}</p>
//             <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
//                 {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''}, {shipping.city}, {shipping.state} – {shipping.pin}
//             </p>
//             <p className="text-sm text-zinc-500">{shipping.phone}</p>
//         </div>

//         {/* Payment method */}
//         <div className="rounded-2xl border border-zinc-100 p-5">
//             <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Payment</p>
//             <p className="text-sm font-semibold text-zinc-800 capitalize">
//                 {payment.method === 'card' && `Card ending ····${payment.cardNumber?.slice(-4)}`}
//                 {payment.method === 'upi' && `UPI: ${payment.upiId}`}
//                 {payment.method === 'cod' && 'Cash on Delivery'}
//             </p>
//         </div>

//         {/* Price breakdown */}
//         <div className="rounded-2xl border border-zinc-100 p-5 flex flex-col gap-3 text-sm">
//             <div className="flex justify-between text-zinc-500">
//                 <span>Subtotal</span>
//                 <span>₹{subtotal.toLocaleString('en-IN')}</span>
//             </div>
//             {discountAmt > 0 && (
//                 <div className="flex justify-between text-emerald-600">
//                     <span>Promo ({promoCode?.toUpperCase()}) – {Math.round(discount * 100)}% off</span>
//                     <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
//                 </div>
//             )}
//             <div className="flex justify-between text-zinc-500">
//                 <span>Shipping</span>
//                 <span className={shippingFee === 0 ? 'text-emerald-600' : ''}>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
//             </div>
//             <div className="border-t border-zinc-100 pt-3 flex justify-between font-black text-zinc-900 text-base">
//                 <span>Total</span>
//                 <span>₹{total.toLocaleString('en-IN')}</span>
//             </div>
//         </div>
//     </div>
// );

// // ── Validation helpers ────────────────────────────────────────────────────────
// const validateShipping = (d) => {
//     const e = {};
//     if (!d.firstName.trim()) e.firstName = 'Required';
//     if (!d.lastName.trim()) e.lastName = 'Required';
//     if (!/\S+@\S+\.\S+/.test(d.email)) e.email = 'Enter a valid email';
//     if (!/^\+?[\d\s-]{8,15}$/.test(d.phone)) e.phone = 'Enter a valid phone';
//     if (!d.address1.trim()) e.address1 = 'Required';
//     if (!d.city.trim()) e.city = 'Required';
//     if (!d.state.trim()) e.state = 'Required';
//     if (!/^\d{6}$/.test(d.pin)) e.pin = 'Enter valid 6-digit PIN';
//     return e;
// };

// const validatePayment = (d) => {
//     const e = {};
//     if (!d.method) { e.method = 'Select a payment method'; return e; }
//     if (d.method === 'card') {
//         if (!d.cardName.trim()) e.cardName = 'Required';
//         if (d.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter valid 16-digit card number';
//         if (!/^\d{2}\/\d{2}$/.test(d.expiry)) e.expiry = 'Format: MM/YY';
//         if (d.cvv.length < 3) e.cvv = 'Enter valid CVV';
//     }
//     if (d.method === 'upi' && !/^\S+@\S+$/.test(d.upiId)) e.upiId = 'Enter valid UPI ID';
//     return e;
// };

// // ── Main Checkout Component ───────────────────────────────────────────────────
// const SHIPPING_THRESHOLD = 999;

// const Checkout = () => {
//     const navigate = useNavigate();
//     const { all_product, cartItem, clearCart } = useContext(ShopContext);

//     const [step, setStep] = useState(0);
//     const [shippingErrors, setShippingErrors] = useState({});
//     const [paymentErrors, setPaymentErrors] = useState({});
//     const [placing, setPlacing] = useState(false);

//     const [shipping, setShipping] = useState({
//         firstName: '', lastName: '', email: '', phone: '',
//         address1: '', address2: '', city: '', state: '', pin: '',
//     });

//     const [payment, setPayment] = useState({
//         method: 'card', cardName: '', cardNumber: '', expiry: '', cvv: '', upiId: '',
//     });

//     // Cart math (same as Cart.jsx)
//     const cartEntries = all_product
//         .map(product => {
//             const item = cartItem?.find(p => Number(p.productId) === product.id);
//             return item ? { product, cartItem: item } : null;
//         })
//         .filter(Boolean);

//     const subtotal = cartEntries.reduce((sum, { product, cartItem }) => sum + product.new_price * cartItem.quantity, 0);
//     const totalItems = cartEntries.reduce((sum, { cartItem }) => sum + cartItem.quantity, 0);
//     const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 99;

//     // Read promo discount from sessionStorage if user applied it in Cart
//     const savedPromo = (() => { try { return JSON.parse(sessionStorage.getItem('shopPromo') || 'null'); } catch { return null; } })();
//     const discount = savedPromo?.discount ?? 0;
//     const promoCode = savedPromo?.code ?? '';
//     const discountAmt = Math.floor(subtotal * discount);
//     const total = subtotal - discountAmt + shippingFee;

//     const updateShipping = (k, v) => { setShipping(p => ({ ...p, [k]: v })); setShippingErrors(e => ({ ...e, [k]: '' })); };
//     const updatePayment = (k, v) => { setPayment(p => ({ ...p, [k]: v })); setPaymentErrors(e => ({ ...e, [k]: '' })); };

//     const handleNext = () => {
//         if (step === 0) {
//             const errs = validateShipping(shipping);
//             if (Object.keys(errs).length) { setShippingErrors(errs); return; }
//         }
//         if (step === 1) {
//             const errs = validatePayment(payment);
//             if (Object.keys(errs).length) { setPaymentErrors(errs); return; }
//         }
//         setStep(s => s + 1);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handlePlaceOrder = async () => {
//         setPlacing(true);
//         // Simulate API call
//         await new Promise(r => setTimeout(r, 1800));
//         // Generate order ID
//         const orderId = 'ORD' + Date.now().toString(36).toUpperCase();
//         // Save order summary for success page
//         sessionStorage.setItem('lastOrder', JSON.stringify({
//             orderId, shipping, payment: { method: payment.method, last4: payment.cardNumber?.slice(-4), upiId: payment.upiId },
//             total, totalItems, shippingFee, discountAmt, promoCode, discount,
//         }));
//         // Clear cart
//         if (clearCart) clearCart();
//         sessionStorage.removeItem('shopPromo');
//         navigate('/order-success');
//     };

//     if (cartEntries.length === 0 && step < 2) {
//         return (
//             <div className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-5">
//                 <p className="text-zinc-400 text-sm">Your cart is empty.</p>
//                 <Link to="/"><button className="px-7 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700">← Shop Now</button></Link>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

//             {/* Header */}
//             <div className="mb-8 text-center">
//                 <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors mb-5">
//                     <i className="fa-solid fa-arrow-left text-[10px]" /> Back to Cart
//                 </Link>
//                 <h1
//                     className="text-3xl sm:text-4xl font-black text-zinc-900"
//                     style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
//                 >
//                     Checkout
//                 </h1>
//             </div>

//             <StepBar current={step} />

//             {/* Step content */}
//             <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8">
//                 {step === 0 && (
//                     <>
//                         <h2 className="text-lg font-black text-zinc-900 mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             Shipping Details
//                         </h2>
//                         <ShippingForm data={shipping} onChange={updateShipping} errors={shippingErrors} />
//                     </>
//                 )}
//                 {step === 1 && (
//                     <>
//                         <h2 className="text-lg font-black text-zinc-900 mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             Payment
//                         </h2>
//                         <PaymentForm data={payment} onChange={updatePayment} errors={paymentErrors} />
//                     </>
//                 )}
//                 {step === 2 && (
//                     <>
//                         <h2 className="text-lg font-black text-zinc-900 mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                             Review Your Order
//                         </h2>
//                         <ReviewStep
//                             shipping={shipping} payment={payment}
//                             cartEntries={cartEntries} subtotal={subtotal}
//                             shippingFee={shippingFee} discountAmt={discountAmt}
//                             total={total} promoCode={promoCode} discount={discount}
//                         />
//                     </>
//                 )}
//             </div>

//             {/* Navigation buttons */}
//             <div className="flex justify-between mt-6 gap-4">
//                 {step > 0 ? (
//                     <button
//                         onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                         className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
//                     >
//                         <i className="fa-solid fa-arrow-left text-xs" /> Back
//                     </button>
//                 ) : <div />}

//                 {step < 2 ? (
//                     <button
//                         onClick={handleNext}
//                         className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors shadow-lg shadow-zinc-200"
//                     >
//                         Continue <i className="fa-solid fa-arrow-right text-xs" />
//                     </button>
//                 ) : (
//                     <button
//                         onClick={handlePlaceOrder}
//                         disabled={placing}
//                         className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
//                     >
//                         {placing ? (
//                             <><i className="fa-solid fa-circle-notch fa-spin" /> Placing Order…</>
//                         ) : (
//                             <><i className="fa-solid fa-lock text-xs" /> Place Order · ₹{total.toLocaleString('en-IN')}</>
//                         )}
//                     </button>
//                 )}
//             </div>

//             {/* Trust note */}
//             <p className="text-center text-zinc-400 text-[11px] mt-5 flex items-center justify-center gap-1">
//                 <i className="fa-solid fa-shield-halved" /> All transactions are encrypted & secure
//             </p>

//             <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
//         </div>
//     );
// };

// export default Checkout;














import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const SHIPPING_THRESHOLD = 999;

// ── Step bar ──────────────────────────────────────────────────────────────────
const STEPS = ['Shipping', 'Payment', 'Review'];

const StepBar = ({ current }) => (
    <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                : active ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200'
                                    : 'bg-zinc-100 text-zinc-400'}`}>
                            {done ? <i className="fa-solid fa-check text-xs" /> : i + 1}
                        </div>
                        <span className={`text-[11px] font-semibold tracking-wide uppercase
              ${active ? 'text-zinc-900' : done ? 'text-emerald-500' : 'text-zinc-400'}`}>
                            {label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`h-0.5 w-16 sm:w-24 mb-5 mx-1 rounded-full transition-all duration-500
              ${i < current ? 'bg-emerald-400' : 'bg-zinc-200'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ── Reusable input components ─────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</label>
        {children}
        {error && (
            <p className="text-xs text-rose-500">
                <i className="fa-solid fa-circle-exclamation mr-1" />{error}
            </p>
        )}
    </div>
);

const Input = ({ className = '', ...props }) => (
    <input
        className={`px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none
      focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-all placeholder-zinc-300 ${className}`}
        {...props}
    />
);

// ── Step 1: Shipping form ─────────────────────────────────────────────────────
const ShippingForm = ({ data, onChange, errors }) => (
    <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First Name" error={errors.firstName}>
                <Input placeholder="Ravi" value={data.firstName} onChange={e => onChange('firstName', e.target.value)} />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
                <Input placeholder="Sharma" value={data.lastName} onChange={e => onChange('lastName', e.target.value)} />
            </Field>
        </div>
        <Field label="Email Address" error={errors.email}>
            <Input type="email" placeholder="ravi@email.com" value={data.email} onChange={e => onChange('email', e.target.value)} />
        </Field>
        <Field label="Phone Number" error={errors.phone}>
            <Input type="tel" placeholder="+91 98765 43210" value={data.phone} onChange={e => onChange('phone', e.target.value)} />
        </Field>
        <Field label="Address Line 1" error={errors.address1}>
            <Input placeholder="House / Flat No., Street" value={data.address1} onChange={e => onChange('address1', e.target.value)} />
        </Field>
        <Field label="Address Line 2 (Optional)">
            <Input placeholder="Area, Landmark" value={data.address2} onChange={e => onChange('address2', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="City" error={errors.city}>
                <Input placeholder="Mumbai" value={data.city} onChange={e => onChange('city', e.target.value)} />
            </Field>
            <Field label="State" error={errors.state}>
                <Input placeholder="Maharashtra" value={data.state} onChange={e => onChange('state', e.target.value)} />
            </Field>
            <Field label="PIN Code" error={errors.pin}>
                <Input placeholder="400001" value={data.pin} onChange={e => onChange('pin', e.target.value)} maxLength={6} />
            </Field>
        </div>
    </div>
);

// ── Step 2: Payment form ──────────────────────────────────────────────────────
const PAYMENT_METHODS = [
    { id: 'card', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
    { id: 'upi', label: 'UPI', icon: 'fa-indian-rupee-sign' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
];

const PaymentForm = ({ data, onChange, errors }) => (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map(m => (
                <label key={m.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${data.method === m.id
                            ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <input type="radio" name="method" value={m.id}
                        checked={data.method === m.id}
                        onChange={() => onChange('method', m.id)}
                        className="accent-zinc-900" />
                    <i className={`fa-solid ${m.icon} text-zinc-500 w-5 text-center`} />
                    <span className="text-sm font-semibold text-zinc-800">{m.label}</span>
                </label>
            ))}
        </div>

        {data.method === 'card' && (
            <div className="flex flex-col gap-5 p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <Field label="Name on Card" error={errors.cardName}>
                    <Input placeholder="RAVI SHARMA" value={data.cardName}
                        onChange={e => onChange('cardName', e.target.value.toUpperCase())} />
                </Field>
                <Field label="Card Number" error={errors.cardNumber}>
                    <Input placeholder="1234 5678 9012 3456" value={data.cardNumber} maxLength={19}
                        onChange={e => {
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                            onChange('cardNumber', raw.match(/.{1,4}/g)?.join(' ') ?? raw);
                        }} />
                </Field>
                <div className="grid grid-cols-2 gap-5">
                    <Field label="Expiry (MM/YY)" error={errors.expiry}>
                        <Input placeholder="08/27" value={data.expiry} maxLength={5}
                            onChange={e => {
                                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                                onChange('expiry', raw.length > 2 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw);
                            }} />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                        <Input placeholder="•••" type="password" maxLength={4} value={data.cvv}
                            onChange={e => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                    </Field>
                </div>
            </div>
        )}

        {data.method === 'upi' && (
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <Field label="UPI ID" error={errors.upiId}>
                    <Input placeholder="yourname@upi" value={data.upiId} onChange={e => onChange('upiId', e.target.value)} />
                </Field>
            </div>
        )}

        {data.method === 'cod' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-500 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                    Pay in cash when your order is delivered. A nominal handling fee of ₹29 may apply.
                </p>
            </div>
        )}
    </div>
);

// ── Step 3: Review ────────────────────────────────────────────────────────────
const ReviewStep = ({ shipping, payment, cartEntries, subtotal, shippingFee, discountAmt, total, promoCode, discount }) => (
    <div className="flex flex-col gap-6">
        {/* Items */}
        <div className="rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Order Items</p>
            </div>
            <div className="divide-y divide-zinc-100">
                {cartEntries.map(({ product, cartItem }) => (
                    <div key={product.id} className="flex items-center gap-4 px-5 py-4">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-zinc-100" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">{product.name}</p>
                            {cartItem.size && <p className="text-xs text-zinc-400">Size: {cartItem.size}</p>}
                            <p className="text-xs text-zinc-400">Qty: {cartItem.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-zinc-900">₹{(product.new_price * cartItem.quantity).toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl border border-zinc-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Deliver To</p>
            <p className="text-sm font-semibold text-zinc-800">{shipping.firstName} {shipping.lastName}</p>
            <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                {shipping.address1}{shipping.address2 ? ', ' + shipping.address2 : ''}, {shipping.city}, {shipping.state} – {shipping.pin}
            </p>
            <p className="text-sm text-zinc-500">{shipping.phone}</p>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-zinc-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Payment</p>
            <p className="text-sm font-semibold text-zinc-800">
                {payment.method === 'card' && `Card ending ····${payment.cardNumber?.replace(/\s/g, '').slice(-4)}`}
                {payment.method === 'upi' && `UPI: ${payment.upiId}`}
                {payment.method === 'cod' && 'Cash on Delivery'}
            </p>
        </div>

        {/* Price breakdown */}
        <div className="rounded-2xl border border-zinc-100 p-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmt > 0 && (
                <div className="flex justify-between text-emerald-600">
                    <span>Promo ({promoCode?.toUpperCase()}) – {Math.round(discount * 100)}% off</span>
                    <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
            )}
            <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? 'text-emerald-600' : ''}>
                    {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </span>
            </div>
            <div className="border-t border-zinc-100 pt-3 flex justify-between font-black text-zinc-900 text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
        </div>
    </div>
);

// ── Validation ────────────────────────────────────────────────────────────────
const validateShipping = (d) => {
    const e = {};
    if (!d.firstName.trim()) e.firstName = 'Required';
    if (!d.lastName.trim()) e.lastName = 'Required';
    if (!/\S+@\S+\.\S+/.test(d.email)) e.email = 'Enter a valid email';
    if (!/^\+?[\d\s-]{8,15}$/.test(d.phone)) e.phone = 'Enter a valid phone number';
    if (!d.address1.trim()) e.address1 = 'Required';
    if (!d.city.trim()) e.city = 'Required';
    if (!d.state.trim()) e.state = 'Required';
    if (!/^\d{6}$/.test(d.pin)) e.pin = 'Enter valid 6-digit PIN';
    return e;
};

const validatePayment = (d) => {
    const e = {};
    if (!d.method) { e.method = 'Select a payment method'; return e; }
    if (d.method === 'card') {
        if (!d.cardName.trim()) e.cardName = 'Required';
        if (d.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter valid 16-digit number';
        if (!/^\d{2}\/\d{2}$/.test(d.expiry)) e.expiry = 'Format: MM/YY';
        if (d.cvv.length < 3) e.cvv = 'Enter valid CVV';
    }
    if (d.method === 'upi' && !/^\S+@\S+$/.test(d.upiId)) e.upiId = 'Enter valid UPI ID (e.g. name@upi)';
    return e;
};

// ── Main Checkout ─────────────────────────────────────────────────────────────
const Checkout = () => {
    const navigate = useNavigate();
    const { all_product, cartItem, setCartItem } = useContext(ShopContext);

    const [step, setStep] = useState(0);
    const [shippingErrors, setShippingErrors] = useState({});
    const [paymentErrors, setPaymentErrors] = useState({});
    const [placing, setPlacing] = useState(false);
    const [apiError, setApiError] = useState('');

    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address1: '', address2: '', city: '', state: '', pin: '',
    });

    const [payment, setPayment] = useState({
        method: 'card', cardName: '', cardNumber: '', expiry: '', cvv: '', upiId: '',
    });

    // ── Cart math ───────────────────────────────────────────────────────────────
    const cartEntries = all_product
        .map(product => {
            const item = cartItem?.find(p => Number(p.productId) === product.id);
            return item ? { product, cartItem: item } : null;
        })
        .filter(Boolean);

    const subtotal = cartEntries.reduce((s, { product, cartItem: ci }) => s + product.new_price * ci.quantity, 0);
    const totalItems = cartEntries.reduce((s, { cartItem: ci }) => s + ci.quantity, 0);
    const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 99;

    // Read promo from sessionStorage (set by Cart page)
    const savedPromo = (() => { try { return JSON.parse(sessionStorage.getItem('shopPromo') || 'null'); } catch { return null; } })();
    const discount = savedPromo?.discount ?? 0;
    const promoCode = savedPromo?.code ?? '';
    const discountAmt = Math.floor(subtotal * discount);
    const total = subtotal - discountAmt + shippingFee;

    const updateShipping = (k, v) => { setShipping(p => ({ ...p, [k]: v })); setShippingErrors(e => ({ ...e, [k]: '' })); };
    const updatePayment = (k, v) => { setPayment(p => ({ ...p, [k]: v })); setPaymentErrors(e => ({ ...e, [k]: '' })); };

    const handleNext = () => {
        if (step === 0) {
            const errs = validateShipping(shipping);
            if (Object.keys(errs).length) { setShippingErrors(errs); return; }
        }
        if (step === 1) {
            const errs = validatePayment(payment);
            if (Object.keys(errs).length) { setPaymentErrors(errs); return; }
        }
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Place order → hit backend ───────────────────────────────────────────────
    const handlePlaceOrder = async () => {
        setPlacing(true);
        setApiError('');

        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                setApiError('You must be logged in to place an order.');
                setPlacing(false);
                return;
            }

            // Build items array with product snapshot (name, image, price at order time)
            const items = cartEntries.map(({ product, cartItem: ci }) => ({
                productId: String(product.id),
                name: product.name,
                image: product.image,
                category: product.category,
                price: product.new_price,
                quantity: ci.quantity,
            }));

            const body = {
                items,
                shipping,
                payment: {
                    method: payment.method,
                    last4: payment.cardNumber?.replace(/\s/g, '').slice(-4) || '',
                    upiId: payment.upiId || '',
                },
                pricing: {
                    subtotal,
                    discountAmt,
                    promoCode,
                    discount,
                    shippingFee,
                    total,
                },
            };

            const res = await fetch('http://localhost:3001/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setApiError(data.error || 'Something went wrong. Please try again.');
                setPlacing(false);
                return;
            }

            // ── Success ─────────────────────────────────────────────────────────────
            // Clear cart in frontend state
            if (setCartItem) setCartItem([]);

            // Remove promo from sessionStorage
            sessionStorage.removeItem('shopPromo');

            // Save minimal info for the success page (orderId only; rest fetched fresh)
            sessionStorage.setItem('lastOrderId', data.orderId);

            navigate('/order-success');

        } catch (err) {
            console.error('placeOrder fetch error:', err);
            setApiError('Network error. Please check your connection and try again.');
            setPlacing(false);
        }
    };

    // ── Empty cart guard ────────────────────────────────────────────────────────
    if (cartEntries.length === 0) {
        return (
            <div className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-5">
                <p className="text-zinc-400 text-sm">Your cart is empty.</p>
                <Link to="/">
                    <button className="px-7 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors">
                        ← Shop Now
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

            {/* Header */}
            <div className="mb-8 text-center">
                <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors mb-5">
                    <i className="fa-solid fa-arrow-left text-[10px]" /> Back to Cart
                </Link>
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Checkout
                </h1>
            </div>

            <StepBar current={step} />

            {/* Step card */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8">
                {step === 0 && (
                    <>
                        <h2 className="text-lg font-black text-zinc-900 mb-6"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Shipping Details</h2>
                        <ShippingForm data={shipping} onChange={updateShipping} errors={shippingErrors} />
                    </>
                )}
                {step === 1 && (
                    <>
                        <h2 className="text-lg font-black text-zinc-900 mb-6"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Payment</h2>
                        <PaymentForm data={payment} onChange={updatePayment} errors={paymentErrors} />
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-lg font-black text-zinc-900 mb-6"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Review Your Order</h2>
                        <ReviewStep
                            shipping={shipping} payment={payment}
                            cartEntries={cartEntries} subtotal={subtotal}
                            shippingFee={shippingFee} discountAmt={discountAmt}
                            total={total} promoCode={promoCode} discount={discount}
                        />
                    </>
                )}
            </div>

            {/* API error */}
            {apiError && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-rose-500" />
                    <p className="text-sm text-rose-600 font-medium">{apiError}</p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 gap-4">
                {step > 0 ? (
                    <button
                        onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <i className="fa-solid fa-arrow-left text-xs" /> Back
                    </button>
                ) : <div />}

                {step < 2 ? (
                    <button onClick={handleNext}
                        className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors shadow-lg shadow-zinc-200">
                        Continue <i className="fa-solid fa-arrow-right text-xs" />
                    </button>
                ) : (
                    <button onClick={handlePlaceOrder} disabled={placing}
                        className="ml-auto flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100">
                        {placing
                            ? <><i className="fa-solid fa-circle-notch fa-spin" /> Placing Order…</>
                            : <><i className="fa-solid fa-lock text-xs" /> Place Order · ₹{total.toLocaleString('en-IN')}</>
                        }
                    </button>
                )}
            </div>

            <p className="text-center text-zinc-400 text-[11px] mt-5 flex items-center justify-center gap-1">
                <i className="fa-solid fa-shield-halved" /> All transactions are encrypted & secure
            </p>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
        </div>
    );
};

export default Checkout;