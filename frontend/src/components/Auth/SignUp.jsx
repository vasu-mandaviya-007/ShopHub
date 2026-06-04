// import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';
// import api_paths from '../../config/apis';

// import Swal from 'sweetalert2';
// // import { toast } from 'react-toastify';

// import { validate, ValidateEmail, ValidatePass, ValidateUsername } from './ValidateData';
// import googleimg from './google.png'

// import Button from '../UI/Button';
// import Input from '../UI/Input';

// const SignUp = () => {

//      const Navigate = useNavigate();

//      const username = useRef(null);
//      const email = useRef(null);
//      const password = useRef(null);
//      const errorbox = useRef([]);
//      const labels = useRef([]);

//      const [passVisible, setpassVisible] = useState(false);
//      const [formData, setformData] = useState({
//           username: "",
//           email: "",
//           password: ""
//      });

//      const handleChange = (e) => {
//           setformData({ ...formData, [e.target.name]: e.target.value });
//      }

//      const handleSubmit = async (e) => {

//           let responseData;

//           if (!validate([username.current, email.current, password.current], errorbox, labels)) {

//                await fetch(api_paths.register, {
//                     method: 'POST',
//                     headers: {
//                          Accept: 'application/form-data',
//                          'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData),
//                })
//                     .then((resp) => resp.json())
//                     .then((data) => responseData = data)


//                if (responseData.success) {

//                     localStorage.setItem('auth-token', responseData.token);
//                     window.location.replace("/");

//                }
//                else {

//                     // swal("Product Deleted Successfully", { icon: "success", })
//                     Swal.fire({
//                          title: 'Sign Up Failed',
//                          text: 'Email already exists',
//                          icon: "error"
//                     })
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
//                               <Input
//                                    type="text"
//                                    value={formData.username}
//                                    name="username"
//                                    placeholder={""}
//                                    inputRef={username}
//                                    onKeyUp={() => ValidateUsername(username.current, errorbox.current[0], labels.current[0])}
//                                    onChange={handleChange}
//                                    spellCheck={false}
//                                    autoComplete={'off'}
//                               />

//                               <label ref={(e) => (labels.current[0] = e)} htmlFor="username" className='floating-label'>Enter Username</label>

//                               <div ref={(e) => (errorbox.current[0] = e)} className="error username-error"> <i className="material-icons">info_outline</i> invalid username </div>

//                          </div>

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <Input
//                                    type="email"
//                                    value={formData.email}
//                                    name="email"
//                                    placeholder={""}
//                                    inputRef={email}
//                                    onKeyUp={() => ValidateEmail(email.current, errorbox.current[1], labels.current[1])}
//                                    onChange={handleChange}
//                                    spellCheck={false}
//                                    autoComplete={'off'}
//                               />

//                               <label ref={(e) => (labels.current[1] = e)} htmlFor="email" className='floating-label'>Enter Email</label>

//                               <div ref={(e) => (errorbox.current[1] = e)} className="error email-error"> <i className="material-icons">info_outline</i> </div>

//                          </div>

//                          <div className="input-box">

//                               <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>

//                               <Input
//                                    type={passVisible ? "text" : "password"}
//                                    value={formData.password}
//                                    name="password"
//                                    placeholder={""}
//                                    inputRef={password}
//                                    onKeyUp={() => ValidatePass(password.current, errorbox.current[2], labels.current[2])}
//                                    onChange={handleChange}
//                               />

//                               <label ref={(e) => (labels.current[2] = e)} htmlFor="password" className='floating-label'>Enter password</label>

//                               <i className={`fa-regular fa-eye${passVisible ? "" : "-slash"} eye-icon`} onClick={() => setpassVisible(!passVisible)}></i>

//                               <div ref={(e) => (errorbox.current[2] = e)} className="error pass-error"><i className="material-icons">info_outline</i> invalid password</div>

//                          </div>

//                     </div>

//                     <Button text={"Sign Up"} onClick={handleSubmit} />

//                     <div className='form-link'>

//                          <p>Already have an account? <span onClick={() => { Navigate("/login") }}>Login</span> </p>

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

// export default SignUp;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import api_paths from '../../config/apis';
import { validateUsername, validateEmail, validatePassword } from './ValidateData';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import googleimg from './google.png';

const SignUp = () => {
    const Navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const validators = {
        username: validateUsername,
        email: validateEmail,
        password: validatePassword,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
        setErrors(er => ({ ...er, [name]: '' }));
    };

    const handleBlur = (name) => {
        setErrors(er => ({ ...er, [name]: validators[name](formData[name]) }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        const newErrors = {
            username: validateUsername(formData.username),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        try {
            const resp = await fetch(api_paths.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await resp.json();

            if (data.success) {
                localStorage.setItem('auth-token', data.token);
                window.location.replace('/');
            } else {
                Swal.fire({
                    title: 'Sign Up Failed',
                    text: 'This email already exists. Please login instead.',
                    icon: 'error',
                    background: '#0f0f0f',
                    color: '#fff',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch {
            Swal.fire({ title: 'Network Error', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'username', type: 'text', label: 'Username' },
        { name: 'email', type: 'email', label: 'Email address' },
        { name: 'password', type: 'password', label: 'Password' },
    ];

    return (
        <AuthLayout title="Create account" subtitle="Join ShopEase and start shopping">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {fields.map(({ name, type, label }) => (
                    <AuthField
                        key={name}
                        type={type}
                        name={name}
                        label={label}
                        value={formData[name]}
                        onChange={handleChange}
                        onKeyUp={() => handleBlur(name)}
                        error={errors[name]}
                        success={!errors[name] && formData[name].length > (name === 'password' ? 7 : 2)}
                    />
                ))}

                {/* Password hint */}
                <p className="text-[11px] text-zinc-400 -mt-2 pl-1">
                    Min. 8 characters with a number and a letter
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-1 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Creating account…
                        </>
                    ) : 'Create Account'}
                </button>

            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100" /></div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-zinc-400 font-medium">or sign up with</span>
                </div>
            </div>

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

            <p className="text-center text-sm text-zinc-500 mt-6">
                Already have an account?{' '}
                <span onClick={() => Navigate('/login')} className="text-rose-500 font-semibold cursor-pointer hover:underline">
                    Sign in
                </span>
            </p>

        </AuthLayout>
    );
};

export default SignUp;