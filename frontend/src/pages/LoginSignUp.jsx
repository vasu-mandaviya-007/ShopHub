import React, { useRef, useState } from 'react';
import './CSS/LoginSignUp.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { validate, inputvalidation } from "./ValidateData";
import Swal from 'sweetalert2'
import Input from '../components/UI/Input';

const LoginSignUp = () => {

     let usename = useRef(null);
     let email = useRef(null);
     let passoword = useRef(null);
     // const { register,handleSubmit,watch,formState : {errors},} = useForm(); 

     const navigator = useNavigate();
     const [state, setState] = useState("Sign Up");
     const [formData, setformData] = useState({
          username: "",
          email: "",
          password: ""
     });

     const login = async () => {

          let responseData;

          if (!validate("login", formData)) {

               await fetch('http://localhost:3001/login', {
                    method: 'POST',
                    headers: {
                         Accept: 'application/form-data',
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               }).then((resp) => resp.json()).then((data) => responseData = data)

               console.log(responseData);

               if (responseData.success) {
                    localStorage.setItem('auth-token', responseData.token);
                    // toast.success("Login Successfull", {
                    //      position: "bottom-center",
                    //      autoClose: 5000,
                    //      hideProgressBar: false,
                    //      closeOnClick: true,
                    //      pauseOnHover: false,
                    //      draggable: true,
                    //      progress: undefined,
                    //      theme: "light",
                    // });
                    // navigator("/");
                    await Swal.fire({
                         title: "Login Successful",
                         text: "Redirection to home page...",
                         icon: "success",
                         timer: 3000,
                         timerProgressBar: true,
                    })
                    window.location.replace("/");
               }
               else {
                    toast.error(responseData.error, {
                         position: "top-center",
                         autoClose: 5000,
                         hideProgressBar: false,
                         closeOnClick: true,
                         pauseOnHover: false,
                         draggable: true,
                         progress: undefined,
                         theme: "light",
                    });
               }
          }
     };

     const signup = async () => {

          let responseData;

          if (!validate("signup", formData)) {

               await fetch('http://localhost:3001/signup', {
                    method: 'POST',
                    headers: {
                         Accept: 'application/form-data',
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               }).then((resp) => resp.json()).then((data) => responseData = data)


               if (responseData.success) {
                    localStorage.setItem('auth-token', responseData.token);
                    window.location.replace("/");
               }
               else {
                    // swal("Product Deleted Successfully", { icon: "success", })
                    Swal.fire({
                         title: 'Sign Up Failed',
                         text: 'Email already exists',
                         icon: "error"
                    })
               }
          }
     };

     const changeHandler = (e) => {
          setformData({ ...formData, [e.target.name]: e.target.value });
     }

     return (



          <div className='loginsignup'>
               <div className="loginsignup-container">
                    <h1>{state}</h1>
                    <div className="loginsignup-fields">

                         {/* {
                              state === "Sign Up"
                                   ?
                                   <div className="input-box">
                                        <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>
                                        <input type="text" id='username' className='input' value={formData.username} onKeyUp={(e) => inputvalidation(e, formData)} onChange={changeHandler} name='username' placeholder='Your Name' spellCheck='false' autoComplete='off' />
                                        <div className="error name-error"></div>
                                   </div>
                                   :
                                   <></>
                         } */}
                         <Input placeholder={"Enter your age"} />

                         <div className="input-box">
                              <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>
                              <input type="email" id='email' className='input' value={formData.email} onKeyUp={(e) => inputvalidation(e, formData)} onChange={changeHandler} name='email' placeholder='Enter Email' required />
                              <div className="error email-error">invalid email </div>
                         </div>
                         <div className="input-box">
                              <i className="success-icon fa-solid fa-circle-check" style={{ color: '#18c994' }}></i>
                              <input type="password" className='input' id='password' value={formData.password} onKeyUp={(e) => inputvalidation(e, formData)} onChange={changeHandler} name='password' placeholder='password' required />
                              <div className="error pass-error">invalid password</div>
                         </div>
                    </div>

                    <button onClick={() => state === "Login" ? login() : signup()}>{state}</button>
                    {
                         state === "Sign Up" ?
                              <p className='loginsignup-login'>Already have an account ? <span onClick={() => setState("Login")}>Login here</span></p>
                              :
                              <p className='loginsignup-login'>Create an Account ? <span onClick={() => setState("Sign Up")} >Sign Up</span></p>
                    }

                    <div className="loginsignup-agree">
                         <input type="checkbox" name=' ' id=' ' />
                         <p>By continuing, i agree to the terms of use & privacy policy.</p>
                    </div>
               </div>
          </div>
     );
}

export default LoginSignUp;
