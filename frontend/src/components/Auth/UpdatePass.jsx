// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';
// import api_paths from '../../config/apis';

// // import Swal from 'sweetalert2';
// // import { toast } from 'react-toastify';

// import { ValidateUpdatePass, ValidateConfPass, ValidatePass } from './ValidateData';

// import Button from '../UI/Button';
// import Input from '../UI/Input';
// import { toast } from 'react-toastify';

// const UpdatePass = () => {

//      const Navigate = useNavigate();

//      useEffect(() => {
//           // Redirect if OTP was not verified
//           if (!sessionStorage.getItem('otpVerified')) {
//                Navigate('/verify');
//           }
//      }, []);

//      const passwordref = useRef(null);
//      const confirmpassref = useRef(null);
//      const errorbox = useRef([]);
//      const labels = useRef([]);

//      const [passVisible, setpassVisible] = useState(false);
//      const [confirmpassVisible, setconfirmpassVisible] = useState(false);

//      const [formData, setformData] = useState({
//           password: "",
//           confirmpass: ""
//      });

//      const handleChange = (e) => {
//           setformData({ ...formData, [e.target.name]: e.target.value });
//      }

//      const handleSubmit = async (e) => {

//           // let responseData;

//           if (!ValidateUpdatePass(passwordref.current, confirmpassref.current, errorbox, labels)) {
//                try {

//                     const response = await fetch(api_paths.UpdatePass, {
//                          method: 'POST',
//                          body: JSON.stringify({ password: formData.password, token: localStorage.getItem("passToken") }),
//                          headers: {
//                               'Content-Type': 'application/json',
//                          }
//                     })
//                     const result = await response.json();

//                     if (result.success) {
//                          toast.success(result.message);
//                          sessionStorage.clear();
//                          localStorage.removeItem("passToken");
//                          localStorage.removeItem("forgetEmail");
//                          Navigate("/login");
//                     }
//                     else {
//                          toast.error(result.error);
//                     }

//                } catch (error) {
//                     toast.error(error);
//                }

//           }
//           else {
//                console.log("error");
//           }

//      }

//      return (

//           <div className='auth-container'>

//                <div className="child-auth-container">

//                     <h1><i className="fa-solid fa-rotate"></i> New Password</h1>

//                     <div className="input-container">

//                          <div className="header-text">
//                               <div className="text-line1">please enter at least 8-digits password</div>
//                          </div>

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <Input
//                                    type={passVisible ? "text" : "password"}
//                                    value={formData.password}
//                                    name="password"
//                                    placeholder={""}
//                                    inputRef={passwordref}
//                                    onKeyUp={() => ValidatePass(passwordref.current, errorbox.current[0], labels.current[0])}
//                                    onChange={handleChange}
//                               />

//                               <label ref={(e) => (labels.current[0] = e)} htmlFor="password" className='floating-label'>New Password</label>

//                               <i className={`fa-regular fa-eye${passVisible ? "" : "-slash"} eye-icon`} onClick={() => setpassVisible(!passVisible)}></i>

//                               <div ref={(e) => (errorbox.current[0] = e)} className="error pass-error"><i className="material-icons">info_outline</i> invalid password</div>

//                          </div>

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <Input
//                                    type={confirmpassVisible ? "text" : "password"}
//                                    value={formData.confirmpass}
//                                    name="confirmpass"
//                                    placeholder={""}
//                                    inputRef={confirmpassref}
//                                    onKeyUp={() => ValidateConfPass(passwordref.current, confirmpassref.current, errorbox.current[1], labels.current[1])}
//                                    onChange={handleChange}
//                                    spellCheck={false}
//                                    autoComplete={'off'}
//                               />

//                               <label ref={(e) => (labels.current[1] = e)} htmlFor="confirmpass" className='floating-label'>Confirm Password</label>

//                               <i className={`fa-regular fa-eye${confirmpassVisible ? "" : "-slash"} eye-icon`} onClick={() => setconfirmpassVisible(!confirmpassVisible)}></i>

//                               <div ref={(e) => (errorbox.current[1] = e)} className="error confirmpass-error"> <i className="material-icons">info_outline</i> invalid username </div>

//                          </div>

//                     </div>

//                     <Button text={"Update Password"} onClick={handleSubmit} />

//                     <div className='form-link'>

//                          <p>Already have an account? <span onClick={() => { Navigate("/login") }}>Login</span> </p>

//                     </div>

//                </div>

//           </div>
//      );
// }

// export default UpdatePass;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api_paths from '../../config/apis';
import { validatePassword, validateConfirmPass } from './ValidateData';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';

const UpdatePass = () => {
     const Navigate = useNavigate();

     useEffect(() => {
          if (!sessionStorage.getItem('otpVerified')) Navigate('/verify');
     }, [Navigate]);

     const [formData, setFormData] = useState({ password: '', confirmpass: '' });
     const [errors, setErrors] = useState({ password: '', confirmpass: '' });
     const [loading, setLoading] = useState(false);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(f => ({ ...f, [name]: value }));
          setErrors(er => ({ ...er, [name]: '' }));
     };

     const handleBlur = (name) => {
          if (name === 'password') {
               setErrors(er => ({ ...er, password: validatePassword(formData.password) }));
          } else {
               setErrors(er => ({ ...er, confirmpass: validateConfirmPass(formData.password, formData.confirmpass) }));
          }
     };

     const handleSubmit = async (e) => {
          e?.preventDefault();
          const passErr = validatePassword(formData.password);
          const confirmErr = validateConfirmPass(formData.password, formData.confirmpass);
          setErrors({ password: passErr, confirmpass: confirmErr });
          if (passErr || confirmErr) return;

          setLoading(true);
          try {
               const response = await fetch(api_paths.UpdatePass, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: formData.password, token: localStorage.getItem('passToken') }),
               });
               const result = await response.json();

               if (result.success) {
                    toast.success(result.message);
                    sessionStorage.clear();
                    localStorage.removeItem('passToken');
                    localStorage.removeItem('forgetEmail');
                    Navigate('/login');
               } else {
                    toast.error(result.error);
               }
          } catch {
               toast.error('Something went wrong. Please try again.');
          } finally {
               setLoading(false);
          }
     };

     return (
          <AuthLayout title="New Password" subtitle="Set a strong password for your account">

               {/* Icon */}
               <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-2xl">
                         <i className="fa-solid fa-rotate" />
                    </div>
               </div>

               <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <AuthField
                         type="password"
                         name="password"
                         label="New Password"
                         value={formData.password}
                         onChange={handleChange}
                         onKeyUp={() => handleBlur('password')}
                         error={errors.password}
                         success={!errors.password && formData.password.length >= 8}
                    />

                    <AuthField
                         type="password"
                         name="confirmpass"
                         label="Confirm Password"
                         value={formData.confirmpass}
                         onChange={handleChange}
                         onKeyUp={() => handleBlur('confirmpass')}
                         error={errors.confirmpass}
                         success={!errors.confirmpass && formData.confirmpass && formData.confirmpass === formData.password}
                    />

                    <p className="text-[11px] text-zinc-400 -mt-2 pl-1">
                         Min. 8 characters with a number and a letter
                    </p>

                    <button
                         type="submit"
                         disabled={loading}
                         className="w-full py-3.5 mt-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {loading ? (
                              <>
                                   <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                   </svg>
                                   Updating…
                              </>
                         ) : (
                              <><i className="fa-solid fa-shield-check text-xs" /> Update Password</>
                         )}
                    </button>

               </form>

               <p className="text-center text-sm text-zinc-500 mt-6">
                    <span onClick={() => Navigate('/login')} className="text-rose-500 font-semibold cursor-pointer hover:underline">
                         ← Back to Login
                    </span>
               </p>

          </AuthLayout>
     );
};

export default UpdatePass;