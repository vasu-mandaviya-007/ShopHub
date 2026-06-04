// import React, { createContext, useState } from "react";
// import { useEffect } from "react";
// import { toast } from "react-toastify";
// import Swal from 'sweetalert2';
// import api_paths from "../config/apis";

// export const ShopContext = createContext(null);

// const ShopContextProvider = (props) => {

//      const [all_product, setall_product] = useState([]);

//      const [cartItem, setcartItem] = useState([]); 

//      const [isloading, setisloading] = useState(true); 

//      const GetCartProduct = async () => {

//           await fetch(api_paths.getcartitem, {
//                method: "POST",
//                headers: {
//                     Accept: 'application/form-data',
//                     'auth-token': `${localStorage.getItem('auth-token')}`,
//                     'Content-Type': 'application/json',
//                },
//                body: "",
//           })
//                .then((res) => res.json())
//                .then((data) => setcartItem(data)) 

//      }

//      const GetAllProduct = async () => {

//           try {
//                await fetch( api_paths.all_products)
//                     .then((response) => response.json())
//                     .then((data) => setall_product(data))
//           } catch (err) {
//                console.log(err);
//           }



//      }

//      useEffect(() => {

//           GetAllProduct();

//           if (localStorage.getItem('auth-token')) {

//                GetCartProduct();

//           }

//           setisloading(false);

//      }, [])

//      const addToCart = (itemId) => {
//           if (localStorage.getItem('auth-token')) {
//                const existingItem = cartItem.find(item => item.productId === itemId);
//                if (existingItem) {
//                     setcartItem(cartItem.map(item =>
//                          item.productId === itemId
//                               ? { ...item, quantity: item.quantity + 1 }
//                               : item
//                     ));
//                } else {
//                     setcartItem([...cartItem, { productId: itemId, quantity: 1 }]);
//                }
//                fetch(api_paths.addtocart, {
//                     method: 'POST',
//                     headers: {
//                          Accept: 'application/form-data',
//                          'auth-token': `${localStorage.getItem('auth-token')}`,
//                          'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ itemId })
//                })
//                     .then((response) => response.json())
//                     .then((data) => {
//                          toast.success("Added to Cart", {
//                               position: "bottom-center",
//                               autoClose: 3000,
//                               hideProgressBar: false,
//                               closeOnClick: true,
//                               pauseOnHover: false,
//                               draggable: true,
//                               progress: undefined,
//                               theme: "dark",
//                          });
//                     })
//           }
//           else {
//                Swal.fire({
//                     title: "Please Login/Register",
//                     text: "Login to Add to Cart",
//                     icon: "warning",
//                     timer: 3000
//                })
//                window.location.replace("#/login");
//           }
//      }

//      const RemoveFromCart = (itemId) => {
//           if (localStorage.getItem('auth-token')) {
//                const existingItem = cartItem.find(item => item.productId === itemId);

//                if (existingItem) {
//                     setcartItem(cartItem.map(item =>
//                          item.productId === itemId
//                               ? { ...item, quantity: item.quantity - 1 }
//                               : item
//                     ));
//                } else {
//                     setcartItem(cartItem.filter(item => item.productId !== itemId));
//                }

//                fetch(api_paths.removefromcart, {
//                     method: 'POST',
//                     headers: {
//                          Accept: 'application/form-data',
//                          'auth-token': `${localStorage.getItem('auth-token')}`,
//                          'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ "itemId": itemId })
//                })
//                     .then((response) => response.json())
//                     .then((data) => {
//                          Swal.fire({
//                               title: "Removed Successfully",
//                               icon: "success",
//                          });
//                          GetCartProduct();
//                     })
//           }
//           else {
//                alert("no token found");
//           }
//      }

//      const getTotalCartItems = () => {
//           return cartItem.length;
//      }

//      const contextValue = { getTotalCartItems, isloading, all_product, cartItem, addToCart, RemoveFromCart }

//      return (
//           <ShopContext.Provider value={contextValue}>
//                {props.children}
//           </ShopContext.Provider>

//      )

// }

// export default ShopContextProvider;




// import React, { createContext, useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import api_paths from "../config/apis";

// export const ShopContext = createContext(null);

// const ShopContextProvider = ({ children }) => {

//      const [all_product, setAllProduct] = useState([]);
//      const [cartItem, setCartItem] = useState([]);
//      const [user, setUser] = useState(null);
//      const [isloading, setIsLoading] = useState(true);

//      /* ─────────────────────────────────────────
//         Auth helper
//      ───────────────────────────────────────── */
//      const authHeaders = () => ({
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "auth-token": localStorage.getItem("auth-token") || "",
//      });

//      const requireAuth = (action = "do that") => {
//           Swal.fire({
//                title: "Login Required",
//                text: `Please login to ${action}.`,
//                icon: "warning",
//                confirmButtonText: "Login",
//                showCancelButton: true,
//                confirmButtonColor: "#f43f5e",
//           }).then(({ isConfirmed }) => {
//                if (isConfirmed) window.location.replace("#/login");
//           });
//      };

//      /* ─────────────────────────────────────────
//         Fetch all products
//      ───────────────────────────────────────── */
//      const getAllProduct = useCallback(async () => {
//           try {
//                const res = await fetch(api_paths.all_products);
//                const data = await res.json();
//                setAllProduct(data);
//           } catch (err) {
//                console.error("getAllProduct:", err);
//           }
//      }, []);

//      /* ── Fetch user profile ── */
//      const getUserProfile = useCallback(async () => {
//           try {
//                const res = await fetch(api_paths.profile ?? "http://localhost:3001/account/profile", {
//                     headers: authHeaders(),
//                });
//                const data = await res.json();
//                if (data.success) setUser(data.user);
//                console.log("Fetched user profile:", data);
//           } catch (err) {
//                console.error("getUserProfile:", err);
//           }
//      }, []);

//      /* ─────────────────────────────────────────
//         Fetch cart from server (source of truth)
//      ───────────────────────────────────────── */
//      const getCartProduct = useCallback(async () => {
//           try {
//                const res = await fetch(api_paths.getcartitem, {
//                     method: "POST",
//                     headers: authHeaders(),
//                     body: "",
//                });
//                const data = await res.json();
//                setCartItem(Array.isArray(data) ? data : []);
//           } catch (err) {
//                console.error("getCartProduct:", err);
//           }
//      }, []);

//      /* ─────────────────────────────────────────
//         Bootstrap
//      ───────────────────────────────────────── */
//      useEffect(() => {
//           const init = async () => {
//                setIsLoading(true);
//                await getAllProduct();
//                if (localStorage.getItem("auth-token")) {
//                     await getCartProduct();         // wait for cart before showing UI
//                }
//                setIsLoading(false);
//           };
//           init();
//      }, [getAllProduct, getCartProduct]);

//      /* ─────────────────────────────────────────
//         addToCart
//      ───────────────────────────────────────── */
//      const addToCart = async (itemId) => {
//           if (!localStorage.getItem("auth-token")) {
//                requireAuth("add items to cart");
//                return;
//           }

//           // Optimistic update
//           setCartItem(prev => {
//                const existing = prev.find(i => Number(i.productId) === itemId);
//                return existing
//                     ? prev.map(i => i.productId === itemId ? { ...i, quantity: i.quantity + 1 } : i)
//                     : [...prev, { productId: itemId, quantity: 1 }];
//           });

//           try {
//                const res = await fetch(api_paths.addtocart, {
//                     method: "POST",
//                     headers: authHeaders(),
//                     body: JSON.stringify({ itemId }),
//                });
//                const data = await res.json();

//                if (data.success !== false) {
//                     toast.success("Added to cart", {
//                          position: "bottom-center",
//                          autoClose: 2000,
//                          theme: "dark",
//                     });
//                } else {
//                     // Roll back on server error
//                     await getCartProduct();
//                     toast.error("Couldn't add item. Please try again.");
//                }
//           } catch {
//                await getCartProduct();
//                toast.error("Network error. Please try again.");
//           }
//      };

//      /* ─────────────────────────────────────────
//         RemoveFromCart — fully removes the item
//      ───────────────────────────────────────── */
//      const RemoveFromCart = async (itemId) => {
//           if (!localStorage.getItem("auth-token")) {
//                requireAuth("remove items");
//                return;
//           }

//           // Optimistic update
//           setCartItem(prev => prev.filter(i => Number(i.productId) !== itemId));

//           try {
//                const res = await fetch(api_paths.removefromcart, {
//                     method: "POST",
//                     headers: authHeaders(),
//                     body: JSON.stringify({ itemId }),
//                });
//                const data = await res.json();

//                if (data.success !== false) {
//                     toast.info("Item removed", {
//                          position: "bottom-center",
//                          autoClose: 1500,
//                          theme: "light",
//                     });
//                } else {
//                     await getCartProduct(); // roll back
//                }
//           } catch {
//                await getCartProduct();
//           }
//      };

//      /* ─────────────────────────────────────────
//         UpdateCartQuantity — increase or decrease
//         qty is the NEW desired quantity.
//         If qty < 1, removes the item entirely.
//      ───────────────────────────────────────── */
//      const UpdateCartQuantity = async (itemId, qty) => {
//           if (!localStorage.getItem("auth-token")) {
//                requireAuth("update cart");
//                return;
//           }

//           if (qty < 1) {
//                await RemoveFromCart(itemId);
//                return;
//           }

//           // Optimistic update
//           setCartItem(prev =>
//                prev.map(i => Number(i.productId) === itemId ? { ...i, quantity: qty } : i)
//           );

//           // Determine direction — call the correct endpoint
//           const existingItem = cartItem.find(i => Number(i.productId) === itemId);
//           const oldQty = existingItem?.quantity ?? 0;
//           const diff = qty - oldQty;

//           if (diff === 0) return;

//           const endpoint = diff > 0 ? api_paths.addtocart : api_paths.removefromcart;
//           const steps = Math.abs(diff);

//           try {
//                // Fire |diff| sequential calls (most backends handle +1/-1 per call)
//                for (let step = 0; step < steps; step++) {
//                     await fetch(endpoint, {
//                          method: "POST",
//                          headers: authHeaders(),
//                          body: JSON.stringify({ itemId }),
//                     });
//                }
//           } catch {
//                await getCartProduct(); // roll back to server state on error
//           }
//      };

//      /* ─────────────────────────────────────────
//         getTotalCartItems — total quantity sum
//      ───────────────────────────────────────── */
//      const getTotalCartItems = () =>
//           cartItem.reduce((sum, i) => sum + (i.quantity ?? 0), 0);

//      /* ─────────────────────────────────────────
//         getTotalCartAmount — subtotal in ₹
//      ───────────────────────────────────────── */
//      const getTotalCartAmount = () =>
//           cartItem.reduce((sum, ci) => {
//                const product = all_product.find(p => p.id === Number(ci.productId));
//                return product ? sum + product.new_price * ci.quantity : sum;
//           }, 0);

//      const contextValue = {
//           all_product,
//           cartItem,
//           user,           // ← exposed for Navbar + Account page
//           setUser,
//           isloading,
//           addToCart,
//           RemoveFromCart,
//           UpdateCartQuantity,   // ← new
//           getTotalCartItems,
//           getTotalCartAmount,   // ← new
//           getCartProduct,       // expose for manual refresh if needed
//      };

//      return (
//           <ShopContext.Provider value={contextValue}>
//                {children}
//           </ShopContext.Provider>
//      );
// };

// export default ShopContextProvider;





import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api_paths from "../config/apis";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {

     const [all_product, setAllProduct] = useState([]);
     const [cartItem, setCartItem] = useState([]);
     const [user, setUser] = useState(null);   // ← user profile
     const [isloading, setIsLoading] = useState(true);

     /* ── Auth headers ── */
     const authHeaders = () => ({
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token") || "",
     });

     const requireAuth = (action = "do that") => {
          Swal.fire({
               title: "Login Required",
               text: `Please login to ${action}.`,
               icon: "warning",
               confirmButtonText: "Login",
               showCancelButton: true,
               confirmButtonColor: "#f43f5e",
          }).then(({ isConfirmed }) => {
               if (isConfirmed) window.location.replace("#/login");
          });
     };

     /* ── Fetch all products ── */
     const getAllProduct = useCallback(async () => {
          try {
               const res = await fetch(api_paths.all_products);
               const data = await res.json();
               setAllProduct(data);
          } catch (err) {
               console.error("getAllProduct:", err);
          }
     }, []);

     /* ── Fetch user profile ── */
     const getUserProfile = useCallback(async () => {
          try {
               const res = await fetch(api_paths.profile ?? "http://localhost:3001/account/profile", {
                    headers: authHeaders(),
               });
               const data = await res.json();
               if (data.success) setUser(data.user);
          } catch (err) {
               console.error("getUserProfile:", err);
          }
     }, []);

     /* ── Fetch cart ── */
     const getCartProduct = useCallback(async () => {
          try {
               const res = await fetch(api_paths.getcartitem, {
                    method: "POST",
                    headers: authHeaders(),
                    body: "",
               });
               const data = await res.json();
               setCartItem(Array.isArray(data) ? data : []);
          } catch (err) {
               console.error("getCartProduct:", err);
          }
     }, []);

     /* ── Bootstrap ── */
     useEffect(() => {
          const init = async () => {
               setIsLoading(true);
               await getAllProduct();
               if (localStorage.getItem("auth-token")) {
                    await Promise.all([getCartProduct(), getUserProfile()]);
               }
               setIsLoading(false);
          };
          init();
     }, [getAllProduct, getCartProduct, getUserProfile]);

     /* ── addToCart ── */
     const addToCart = async (itemId) => {
          if (!localStorage.getItem("auth-token")) {
               requireAuth("add items to cart");
               return;
          }
          setCartItem(prev => {
               const existing = prev.find(i => Number(i.productId) === itemId);
               return existing
                    ? prev.map(i => Number(i.productId) === itemId ? { ...i, quantity: i.quantity + 1 } : i)
                    : [...prev, { productId: itemId, quantity: 1 }];
          });
          try {
               const res = await fetch(api_paths.addtocart, {
                    method: "POST", headers: authHeaders(), body: JSON.stringify({ itemId }),
               });
               const data = await res.json();
               if (data.success !== false) {
                    toast.success("Added to cart", { position: "bottom-center", autoClose: 2000, theme: "dark" });
               } else {
                    await getCartProduct();
                    toast.error("Couldn't add item. Please try again.");
               }
          } catch {
               await getCartProduct();
               toast.error("Network error. Please try again.");
          }
     };

     /* ── RemoveFromCart ── */
     const RemoveFromCart = async (itemId) => {
          if (!localStorage.getItem("auth-token")) { requireAuth("remove items"); return; }
          setCartItem(prev => prev.filter(i => Number(i.productId) !== itemId));
          try {
               const res = await fetch(api_paths.removefromcart, {
                    method: "POST", headers: authHeaders(), body: JSON.stringify({ itemId }),
               });
               const data = await res.json();
               if (data.success === false) await getCartProduct();
               else toast.info("Item removed", { position: "bottom-center", autoClose: 1500, theme: "light" });
          } catch {
               await getCartProduct();
          }
     };

     /* ── UpdateCartQuantity ── */
     const UpdateCartQuantity = async (itemId, qty) => {
          if (!localStorage.getItem("auth-token")) { requireAuth("update cart"); return; }
          if (qty < 1) { await RemoveFromCart(itemId); return; }

          const existingItem = cartItem.find(i => Number(i.productId) === itemId);
          const oldQty = existingItem?.quantity ?? 0;
          const diff = qty - oldQty;
          if (diff === 0) return;

          setCartItem(prev =>
               prev.map(i => Number(i.productId) === itemId ? { ...i, quantity: qty } : i)
          );
          const endpoint = diff > 0 ? api_paths.addtocart : api_paths.removefromcart;
          try {
               for (let s = 0; s < Math.abs(diff); s++) {
                    await fetch(endpoint, { method: "POST", headers: authHeaders(), body: JSON.stringify({ itemId }) });
               }
          } catch {
               await getCartProduct();
          }
     };

     /* ── Helpers ── */
     const getTotalCartItems = () => cartItem.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
     const getTotalCartAmount = () => cartItem.reduce((sum, ci) => {
          const product = all_product.find(p => p.id === Number(ci.productId));
          return product ? sum + product.new_price * ci.quantity : sum;
     }, 0);

     const contextValue = {
          all_product,
          cartItem,
          user,           // ← exposed for Navbar + Account page
          setUser,        // ← Account page updates it after profile save
          isloading,
          addToCart,
          RemoveFromCart,
          UpdateCartQuantity,
          getTotalCartItems,
          getTotalCartAmount,
          getCartProduct,
          getUserProfile,
     };

     return (
          <ShopContext.Provider value={contextValue}>
               {children}
          </ShopContext.Provider>
     );
};

export default ShopContextProvider;