// import React, { useRef, useState } from 'react';
// import './Auth.css';
// import api_paths from '../../config/apis';

// import { Link, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';

// import { validate, ValidateEmail, ValidatePass } from './ValidateData';
// import googleimg from './google.png'

// import Input from '../UI/Input';
// import Button from '../UI/Button';



// const Login = () => {

//      const email = useRef(null);
//      const password = useRef(null);
//      const errorbox = useRef([]);
//      const labels = useRef([]);

//      const [passVisible, setpassVisible] = useState(false);
//      const Navigate = useNavigate();
//      const [formData, setformData] = useState({
//           email: "",
//           password: ""
//      });

//      const handleChange = (e) => {
//           setformData({ ...formData, [e.target.name]: e.target.value });
//      }

//      const handleSubmit = async (e) => {

//           let responseData;

//           if (!validate([email.current, password.current], errorbox, labels)) {

//                await fetch( api_paths.login , {
//                     method: 'POST',
//                     headers: {
//                          Accept: 'application/form-data',
//                          'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData),
//                })
//                     .then((resp) => resp.json())
//                     .then((data) => responseData = data)

//                console.log(responseData);

//                if (responseData.success) {

//                     localStorage.setItem('auth-token', responseData.token);

//                     await Swal.fire({
//                          title: "Login Successful",
//                          text: "Redirection to home page...",
//                          icon: "success",
//                          timer: 3000,
//                          limit : 1,
//                          timerProgressBar: true,
//                     })

//                     window.location.replace("/");

//                }
//                else {

//                     toast.error(responseData.error, {
//                          position: "top-center",
//                          autoClose: 3000,
//                          hideProgressBar: false,
//                          closeOnClick: true,
//                          pauseOnHover: false,
//                          draggable: true,
//                          progress: undefined,
//                          theme: "colored",
//                     });

//                }

//                console.log("no Error");

//           }
//           else {

//                console.log("Error");

//           }

//      }

//      return (
//           <div className='auth-container'>

//                <div className="child-auth-container">

//                     <h1>Login</h1>

//                     <div className="input-container">

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <input
//                                    type="email"
//                                    value={formData.email}
//                                    name="email"
//                                    placeholder={""}
//                                    inputRef={email}
//                                    onKeyUp={() => ValidateEmail(email.current, errorbox.current[0], labels.current[0])}
//                                    onChange={handleChange}
//                                    spellCheck={false}
//                                    autoComplete={'off'}
//                               />

//                               <label ref={(e) => (labels.current[0] = e)} htmlFor="email" className='floating-label'>Enter Email</label>

//                               <div ref={(e) => (errorbox.current[0] = e)} className="error email-error"> <i className="material-icons">info_outline</i> </div>

//                          </div>

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <input
//                                    type={passVisible ? "text" : "password"}
//                                    value={formData.password}
//                                    name="password"
//                                    placeholder={""}
//                                    inputRef={password}
//                                    onKeyUp={() => ValidatePass(password.current, errorbox.current[1], labels.current[1])}
//                                    onChange={handleChange}
//                               />

//                               <label ref={(e) => (labels.current[1] = e)} htmlFor="password" className='floating-label'>Enter password</label>

//                               <i className={`fa-regular fa-eye${passVisible ? "" : "-slash"} eye-icon`} onClick={() => setpassVisible(!passVisible)}></i>

//                               <div ref={(e) => (errorbox.current[1] = e)} className="error pass-error"><i className="material-icons">info_outline</i> invalid password</div>

//                          </div>

//                     </div>

//                     <div className="form-link forget-pass-link">

//                          <Link to={"/forgetPass"}><span>foreget passoword</span></Link>

//                     </div>

//                     <Button text={"Login"} onClick={handleSubmit} />

//                     <div className='form-link'>

//                          <p>Do not have an Account? <span onClick={() => { Navigate("/signup") }}>SignUp</span> </p>

//                     </div>

//                     <div className="line"></div>

//                     <div className="media-options">

//                          <a href="/" className="field facebook">
//                               <i className='fa-brands fa-facebook facebook-icon'></i>
//                               <span>Login with Facebook</span>
//                          </a>

//                     </div>

//                     <div className="media-options">

//                          <a href="/" className="field google">
//                               <img src={googleimg} alt="" className="google-img" />
//                               <span>Login with Google</span>
//                          </a>

//                     </div>

//                </div>
//           </div>
//      );
// }

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import api_paths from '../../config/apis';
import { validateEmail, validatePassword } from './ValidateData';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import googleimg from './google.png';


const Login = () => {
     const Navigate = useNavigate();
     const [formData, setFormData] = useState({ email: '', password: '' });
     const [errors, setErrors] = useState({ email: '', password: '' });
     const [loading, setLoading] = useState(false);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(f => ({ ...f, [name]: value }));
          // Clear error on type
          setErrors(er => ({ ...er, [name]: '' }));
     };

     const handleBlur = (name) => {
          const err = name === 'email' ? validateEmail(formData.email) : validatePassword(formData.password);
          setErrors(er => ({ ...er, [name]: err }));
     };

     const handleSubmit = async (e) => {
          e?.preventDefault();

          const emailErr = validateEmail(formData.email);
          const passErr = validatePassword(formData.password);
          setErrors({ email: emailErr, password: passErr });
          if (emailErr || passErr) return;

          setLoading(true);
          try {
               const resp = await fetch(api_paths.login, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
               });
               const data = await resp.json();

               if (data.success) {
                    localStorage.setItem('auth-token', data.token);
                    await Swal.fire({
                         title: 'Login Successful',
                         text: 'Redirecting to home…',
                         icon: 'success',
                         timer: 2500,
                         timerProgressBar: true,
                         background: '#0f0f0f',
                         color: '#fff',
                    });
                    window.location.replace('/');
               } else {
                    toast.error(data.error, { position: 'top-center', theme: 'colored', autoClose: 3000 });
               }
          } catch {
               toast.error('Something went wrong. Please try again.', { position: 'top-center' });
          } finally {
               setLoading(false);
          }
     };

     return (
          <AuthLayout title="Welcome back" subtitle="Sign in to your ShopEase account">

               <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <AuthField
                         type="email"
                         name="email"
                         label="Email address"
                         value={formData.email}
                         autoComplete='on'
                         onChange={handleChange}
                         onKeyUp={() => handleBlur('email')}
                         error={errors.email}
                         success={!errors.email && formData.email.length > 3}
                    />

                    <AuthField
                         type="password"
                         name="password"
                         label="Password"
                         value={formData.password}
                         onChange={handleChange}
                         onKeyUp={() => handleBlur('password')}
                         error={errors.password}
                         success={!errors.password && formData.password.length >= 8}
                    />

                    {/* Forgot password */}
                    <div className="text-right -mt-2">
                         <Link to="/forgetPass" className="linearext-xs text-sm text-rose-500 font-semibold hover:underline">
                              Forgot password?
                         </Link>
                    </div>

                    {/* Submit */}
                    <button
                         type="submit"
                         disabled={loading}
                         className="w-full py-3.5 mt-1 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadowlinearlg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {loading ? (
                              <>
                                   <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                   </svg>
                                   Signing in…
                              </>
                         ) : 'Sign In'}
                    </button>

               </form>

               {/* Divider */}
               <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-zinc-100" />
                    </div>
                    <div className="relative flex justify-center">
                         <span className="bg-white px-3 text-xs text-zinc-400 font-medium">or continue with</span>
                    </div>
               </div>

               {/* Social */}
               <div className="flex flex-col gap-3">
                    <button
                         onClick={() => {
                              toast.info("Comming Soon")
                         }}
                         className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#4267b2] text-white text-sm font-medium hover:bg-[#375596] hover:shadow-md transition-colors"
                    >
                         <i className="fa-brands fa-facebook text-base" /> Continue with Facebook
                    </button>

                    <button
                         onClick={() => {
                              toast.info("Comming Soon")
                         }}
                         className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-gary-400 hover:shadow transition-colors"
                    >
                         <img src={googleimg} alt="Google" className="w-5 h-5 object-contain" /> Continue with Google
                    </button>
               </div>

               {/* Footer link */}
               <p className="text-center text-sm text-zinc-500 mt-6">
                    Don't have an account?{' '}
                    <span onClick={() => Navigate('/signup')} className="text-rose-500 font-semibold cursor-pointer hover:underline" >
                         Sign up
                    </span>
               </p>

          </AuthLayout>
     );
};

export default Login;