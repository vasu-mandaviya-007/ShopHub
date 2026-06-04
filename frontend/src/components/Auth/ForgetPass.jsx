// import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './Auth.css';

// import api_path from '../../config/apis'
// import { validate, ValidateEmail } from './ValidateData';

// import Input from '../UI/Input';
// import Button from '../UI/Button';



// const ForgetPass = () => {

//      const Navigator = useNavigate();

//      const emailref = useRef(null);
//      const errorbox = useRef([]);
//      const labels = useRef([]);
//      const [email, setemail] = useState();

//      const handleChange = (e) => {
//           setemail(e.target.value);
//      }

//      const handleSubmit = async (e) => {

//           if (!validate([emailref.current], errorbox, labels)) {

//                const response = await fetch(api_path.forgetpass, {
//                     method: 'POST',
//                     headers: {
//                          'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ email })
//                })


//                const result = await response.json();

//                if (result.success) {

//                     toast.success(result.message, {
//                          position: "top-center",
//                          autoClose: 3000,
//                          hideProgressBar: false,
//                          closeOnClick: true,
//                          pauseOnHover: false,
//                          draggable: true,
//                          progress: undefined,
//                          theme: "light",
//                     });

//                     localStorage.setItem('passToken', result.token);
//                     localStorage.setItem('forgetEmail', email);

//                     // Simulate OTP sending
//                     sessionStorage.setItem('otpSent', 'true');
//                     Navigator("/verify", { state: { email } });

//                } else {

//                     toast.error(result.error, {
//                          position: "top-center",
//                          autoClose: 3000,
//                          hideProgressBar: false,
//                          closeOnClick: true,
//                          pauseOnHover: false,
//                          draggable: true,
//                          progress: undefined,
//                          theme: "light",
//                     });

//                }

//           }

//      }

//      return (

//           <div className='auth-container'>

//                <div className="child-auth-container">

//                     <h1>Forget Password</h1>

//                     <div className="header-text">
//                          <div className="text-line1">Enter your registered email, we will send you 6-digit OTP for forget password </div>
//                     </div>

//                     <div className="input-container">

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <Input
//                                    type="email"
//                                    value={email}
//                                    name="email"
//                                    placeholder={""}
//                                    inputRef={emailref}
//                                    onKeyUp={() => ValidateEmail(emailref.current, errorbox.current[0], labels.current[0])}
//                                    onChange={handleChange}
//                                    spellCheck={false}
//                                    autoComplete={'off'}
//                               />

//                               <label ref={(e) => (labels.current[0] = e)} htmlFor="email" className='floating-label'>Enter Email</label>

//                               <div ref={(e) => (errorbox.current[0] = e)} className="error email-error"> <i className="material-icons">info_outline</i> </div>


//                          </div>

//                     </div>

//                     <Button text={"Send Otp"} onClick={handleSubmit} />

//                </div>

//           </div>

//      );
// }

// export default ForgetPass;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api_path from '../../config/apis';
import { validateEmail } from './ValidateData';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';

const ForgetPass = () => {
  const Navigator = useNavigate();
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const err = validateEmail(email); 
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const response = await fetch(api_path.forgetpass, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(result.message, { position: 'top-center', autoClose: 3000 });
        localStorage.setItem('passToken',    result.token);
        localStorage.setItem('forgetEmail',  email);
        sessionStorage.setItem('otpSent',    'true');
        Navigator('/verify', { state: { email } });
      } else {
        toast.error(result.error, { position: 'top-center', autoClose: 3000 });
      }
    } catch {
      toast.error('Network error. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a 6-digit OTP">

      {/* Illustration icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 text-2xl">
          <i className="fa-solid fa-lock" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          type="email"
          name="email"
          label="Registered email address"
          value={email}
          autoComplete='on'
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          onKeyUp={() => setError(validateEmail(email))}
          error={error}
          success={!error && email.length > 3}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Sending OTP…
            </>
          ) : (
            <><i className="fa-solid fa-paper-plane text-xs" /> Send OTP</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Remember your password?{' '}
        <span onClick={() => Navigator('/login')} className="text-rose-500 font-semibold cursor-pointer hover:underline">
          Sign in
        </span>
      </p>

    </AuthLayout>
  );
};

export default ForgetPass;