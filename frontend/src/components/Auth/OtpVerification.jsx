// import React, { useEffect, useMemo, useState } from 'react';
// // import Input from '../UI/Input';
// import './Auth.css';
// import Button from '../UI/Button';
// import Countdown from 'react-countdown';

// import { Navigate, useNavigate } from 'react-router-dom';
// import OtpInput from 'otp-input-react';
// import api_path from '../../config/apis'
// import { toast } from 'react-toastify';


// const OtpVerification = () => {

//      const Navigator = useNavigate();


//      const [otp, setotp] = useState("");
//      const [otptimer, setotptimer] = useState(null);
//      const [IsOtpExpired, setIsOtpExpired] = useState(false);
//      const targetTime = useMemo(()=> Date.now() + otptimer,[otptimer]);

//      // const location = useLocation();
//      // const { phonenumber } = location.state || {};
//      // const number = `+919313297933`;

//      useEffect(() => {

//           if (!sessionStorage.getItem('otpSent')) {
//                Navigator('/forgetpass');
//           }

//           const getTime = async () => {
//                try {
//                     const response = await fetch(api_path.GetOtpTimer, {
//                          method: 'POST',
//                          body: JSON.stringify({ token: localStorage.getItem('passToken') }),
//                          headers: {
//                               'Content-Type': 'application/json',
//                          }
//                     })

//                     let result = await response.json();

//                     if (result.success) {

//                          const remainingtime = new Date(result.sendtime).getTime() - new Date().getTime();

//                          if (remainingtime > 0) {
//                               setotptimer(remainingtime);
//                          }
//                          else {
//                               setIsOtpExpired(true);
//                          }
//                     }
//                     else {
//                          toast.error(result.error);
//                     }

//                } catch (error) {
//                     console.log(error);
//                     toast.error(error);
//                }
//           }
//           getTime();
//      },[Navigator]);

//      const resentOtp = async () => {

//           const response = await fetch(api_path.forgetpass, {
//                method: 'POST',
//                headers: {
//                     'Content-Type': 'application/json'
//                },
//                body: JSON.stringify({ email: localStorage.getItem('forgetEmail') })
//           })

//           const result = await response.json();

//           if (result.success) {

//                toast.success(result.message, {
//                     position: "top-center",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                });

//                localStorage.setItem('passToken', result.token);
//                setotptimer(1 * 60 * 1000);
//                setIsOtpExpired(false);



//                // localStorage.setItem('forgetEmail', result.token);

//           } else {

//                toast.error(result.error, {
//                     position: "top-center",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                });

//           }

//      }

//      const handleSendOtp = async () => {

//           const response = await fetch(api_path.otpverify, {
//                method: 'POST',
//                body: JSON.stringify({ otp: otp }),
//                headers: {
//                     'Content-Type': 'application/json',
//                }
//           })

//           const result = await response.json();

//           console.log(result);

//           if (result.success) {
//                toast.success(result.message, {
//                     position: "top-center",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                });

//                sessionStorage.setItem('otpVerified', 'true');
//                Navigator("/updatepass");

//           }
//           else {
//                toast.error(result.error, {
//                     position: "top-center",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                });
//           }

//      };


//      return (
//           <div className='auth-container otp-verification-page'>

//                <div className="child-auth-container">


//                     <h1>Verify OTP</h1>

//                     <div id="recaptcha-container"></div>

//                     <div className="header-text">
//                          <div className="text-line1">Please enter the OTP send to send to your phone number</div>
//                          <div className="text-line2">OTP send to 9313297933 <span>Change</span> </div>
//                     </div>

//                     {/* <form action=""> */}

//                     <div className="input-container">

//                          <OtpInput
//                               value={otp}
//                               OTPLength={6}
//                               otpType={"number"}
//                               onChange={setotp}
//                               disabled={false}
//                               autoFocus
//                               className="otp-container"
//                          ></OtpInput>

//                     </div>


//                     <div className="resend-otp-timer form-link">

//                          {otptimer !== null && !IsOtpExpired
//                               ? (<Countdown onComplete={() => { setIsOtpExpired(true) }} date={targetTime} />)
//                               : (<p>Didn't receive an SMS? <span onClick={resentOtp}>Resend OTP</span></p>)
//                          }

//                     </div>

//                     <Button text={"Verify Otp"} onClick={handleSendOtp} />

//                     <div className='form-link'>

//                          <p>Already have an account? <span onClick={() => { Navigator("/login") }}>Login</span> </p>

//                     </div>

//                     {/* </form> */}
//                </div>
//           </div>
//      );
// }

// export default OtpVerification;








// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Countdown from 'react-countdown';
// import OtpInput from 'otp-input-react';

// import api_path from '../../config/apis';
// import AuthLayout from './AuthLayout';

// import "./otp.css";

// const OtpVerification = () => {
//   const Navigator = useNavigate();
//   const [otp,           setOtp]           = useState('');
//   const [otpTimer,      setOtpTimer]      = useState(null);
//   const [isExpired,     setIsExpired]     = useState(false);
//   const [loading,       setLoading]       = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   const targetTime = useMemo(() => Date.now() + (otpTimer ?? 0), [otpTimer]);

//   useEffect(() => {
//     if (!sessionStorage.getItem('otpSent')) Navigator('/forgetpass');

//     const getTime = async () => {
//       try {
//         const response = await fetch(api_path.GetOtpTimer, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ token: localStorage.getItem('passToken') }),
//         });
//         const result = await response.json();
//         if (result.success) {
//           const remaining = new Date(result.sendtime).getTime() - Date.now();
//           remaining > 0 ? setOtpTimer(remaining) : setIsExpired(true);
//         } else {
//           toast.error(result.error);
//         }
//       } catch (err) {
//         toast.error('Could not fetch OTP timer.');
//       }
//     };
//     getTime();
//   }, [Navigator]);

//   const handleResend = async () => {
//     setResendLoading(true);
//     try {
//       const res    = await fetch(api_path.forgetpass, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: localStorage.getItem('forgetEmail') }),
//       });
//       const result = await res.json();
//       if (result.success) {
//         toast.success(result.message, { position: 'top-center', autoClose: 3000 });
//         localStorage.setItem('passToken', result.token);
//         setOtpTimer(60 * 1000);
//         setIsExpired(false);
//         setOtp('');
//       } else {
//         toast.error(result.error, { position: 'top-center' });
//       }
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleVerify = async (e) => {
//     e?.preventDefault();
//     if (otp.length < 6) {
//       toast.error('Please enter the complete 6-digit OTP', { position: 'top-center' });
//       return;
//     }
//     setLoading(true);
//     try {
//       const res    = await fetch(api_path.otpverify, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ otp }),
//       });
//       const result = await res.json();
//       if (result.success) {
//         toast.success(result.message, { position: 'top-center', autoClose: 2000 });
//         sessionStorage.setItem('otpVerified', 'true');
//         Navigator('/updatepass');
//       } else {
//         toast.error(result.error, { position: 'top-center' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const email = localStorage.getItem('forgetEmail') || '';
//   const maskedEmail = email
//     ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
//     : '';

//   return (
//     <AuthLayout title="Verify OTP" subtitle={`Code sent to ${maskedEmail}`}>

//       {/* Icon */}
//       <div className="flex justify-center mb-6">
//         <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 text-2xl">
//           <i className="fa-solid fa-envelope-open-text" />
//         </div>
//       </div>

//       <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">

//         {/* OTP boxes */}
//         <OtpInput
//           value={otp}
//           OTPLength={6}
//           otpType="number"
//           onChange={setOtp}
//           disabled={false}
//           autoFocus
//           inputStyles={{
//             width: '44px',
//             height: '44px',
//             borderRadius: '12px',
//             border: '2px solid #e4e4e7',
//             fontSize: '20px',
//             fontWeight: '700',
//             color: '#18181b',
//             outline: 'none',
//             transition: 'border-color 0.2s',
//           }}
//           focusStyle={{ borderColor: '#f43f5e' }}
//           className="gap-2"
//         />

//         {/* Timer / resend */}
//         <div className="text-sm text-zinc-500">
//           {otpTimer !== null && !isExpired ? (
//             <span>
//               Resend OTP in{' '}
//               <span className="font-bold text-rose-500">
//                 <Countdown date={targetTime} onComplete={() => setIsExpired(true)} />
//               </span>
//             </span>
//           ) : (
//             <span>
//               Didn't receive code?{' '}
//               <button
//                 type="button"
//                 onClick={handleResend}
//                 disabled={resendLoading}
//                 className="text-rose-500 font-semibold hover:underline disabled:opacity-60"
//               >
//                 {resendLoading ? 'Sending…' : 'Resend OTP'}
//               </button>
//             </span>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading || otp.length < 6}
//           className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
//               </svg>
//               Verifying…
//             </>
//           ) : (
//             <><i className="fa-solid fa-shield-check text-xs" /> Verify OTP</>
//           )}
//         </button>

//       </form>

//       <p className="text-center text-sm text-zinc-500 mt-6">
//         <span onClick={() => Navigator('/login')} className="text-rose-500 font-semibold cursor-pointer hover:underline">
//           ← Back to Login
//         </span>
//       </p>

//     </AuthLayout>
//   );
// };

// export default OtpVerification;



import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';

import api_path from '../../config/apis';
import AuthLayout from './AuthLayout';

import "./otp.css";

/* ─── Custom OTP Input ───────────────────────────────────────── */
const OtpInputCustom = ({ value, onChange, length = 6, disabled }) => {
    const inputsRef = useRef([]);
    const [shake, setShake] = useState(false);

    // Keep internal array in sync with parent string
    const digits = Array.from({ length }, (_, i) => value[i] || '');

    const focusAt = (idx) => {
        const el = inputsRef.current[idx];
        if (el) { el.focus(); el.select(); }
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 450);
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const next = [...digits];
            if (next[idx]) {
                next[idx] = '';
                onChange(next.join(''));
            } else if (idx > 0) {
                next[idx - 1] = '';
                onChange(next.join(''));
                focusAt(idx - 1);
            }
            return;
        }
        if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); focusAt(idx - 1); return; }
        if (e.key === 'ArrowRight' && idx < length - 1) { e.preventDefault(); focusAt(idx + 1); return; }
    };

    const handleInput = (e, idx) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) return;

        // Handle paste of multiple digits
        if (raw.length > 1) {
            const next = [...digits];
            let cursor = idx;
            for (let i = 0; i < raw.length && cursor < length; i++, cursor++) {
                next[cursor] = raw[i];
            }
            onChange(next.join(''));
            focusAt(Math.min(idx + raw.length, length - 1));
            return;
        }

        const next = [...digits];
        next[idx] = raw[0];
        onChange(next.join(''));
        if (idx < length - 1) focusAt(idx + 1);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (!pasted) return;
        const next = Array.from({ length }, (_, i) => pasted[i] || '');
        onChange(next.join(''));
        focusAt(Math.min(pasted.length, length - 1));
    };

    // Expose triggerShake via ref — not needed externally here, but useful
    return (
        <div className={`otp-input-wrapper${shake ? ' shake' : ''}`} onPaste={handlePaste}>
            {Array.from({ length }, (_, idx) => (
                <React.Fragment key={idx}>
                    {/* Separator dot between digit 3 and 4 */}
                    {/* {idx === 3 && <span className="otp-separator" aria-hidden="true" />} */}

                    <div className="otp-cell">
                        <input
                            ref={(el) => (inputsRef.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digits[idx]}
                            disabled={disabled}
                            autoFocus={idx === 0}
                            className={digits[idx] ? 'filled' : ''}
                            onChange={(e) => handleInput(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            onFocus={(e) => e.target.select()}
                            aria-label={`OTP digit ${idx + 1}`}
                        />
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

/* ─── Page Component ─────────────────────────────────────────── */
const OtpVerification = () => {
    const Navigator = useNavigate();
    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const targetTime = useMemo(() => Date.now() + (otpTimer ?? 0), [otpTimer]);

    useEffect(() => {
        if (!sessionStorage.getItem('otpSent')) Navigator('/forgetpass');

        const getTime = async () => {
            try {
                const response = await fetch(api_path.GetOtpTimer, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: localStorage.getItem('passToken') }),
                });
                const result = await response.json();
                if (result.success) {
                    const remaining = new Date(result.sendtime).getTime() - Date.now();
                    remaining > 0 ? setOtpTimer(remaining) : setIsExpired(true);
                } else {
                    toast.error(result.error);
                }
            } catch {
                toast.error('Could not fetch OTP timer.');
            }
        };
        getTime();
    }, [Navigator]);

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const res = await fetch(api_path.forgetpass, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: localStorage.getItem('forgetEmail') }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(result.message, { position: 'top-center', autoClose: 3000 });
                localStorage.setItem('passToken', result.token);
                setOtpTimer(60 * 1000);
                setIsExpired(false);
                setOtp('');
            } else {
                toast.error(result.error, { position: 'top-center' });
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e?.preventDefault();
        if (otp.length < 6) {
            toast.error('Please enter the complete 6-digit OTP', { position: 'top-center' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(api_path.otpverify, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(result.message, { position: 'top-center', autoClose: 2000 });
                sessionStorage.setItem('otpVerified', 'true');
                Navigator('/updatepass');
            } else {
                toast.error(result.error, { position: 'top-center' });
            }
        } finally {
            setLoading(false);
        }
    };

    const email = localStorage.getItem('forgetEmail') || '';
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
        : '';

    return (
        <AuthLayout title="Verify OTP" subtitle={`Code sent to ${maskedEmail}`}>

            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-cyan-500 text-2xl">
                    <i className="fa-solid fa-envelope-open-text" />
                </div>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">

                {/* Custom OTP Input */}
                <OtpInputCustom
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    disabled={loading}
                />

                {/* Timer / resend */}
                <div className="text-sm text-zinc-500">
                    {otpTimer !== null && !isExpired ? (
                        <span>
                            Resend OTP in{' '}
                            <span className="font-bold text-rose-500">
                                <Countdown date={targetTime} onComplete={() => setIsExpired(true)} />
                            </span>
                        </span>
                    ) : (
                        <span>
                            Didn't receive code?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-rose-500 font-semibold hover:underline disabled:opacity-60"
                            >
                                {resendLoading ? 'Sending…' : 'Resend OTP'}
                            </button>
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-3.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Verifying…
                        </>
                    ) : (
                        <><i className="fa-solid fa-shield-check text-xs" /> Verify OTP</>
                    )}
                </button>

            </form>

            <p className="text-center text-sm text-zinc-500 mt-6">
                <span onClick={() => Navigator('/login')} className="text-rose-500 font-semibold cursor-pointer hover:underline">
                    ← Back to Login
                </span>
            </p>

        </AuthLayout>
    );
};

export default OtpVerification;