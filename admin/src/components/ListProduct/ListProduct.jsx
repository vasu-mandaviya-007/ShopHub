import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import api_paths from '../../config/apis';
// import Swal from 'sweetalert2';

const ListProduct = () => {

     const [allproducts, setallproducts] = useState([]);

     const fetchInfo = async () => {
          console.log(api_paths.all_products);
          await fetch(api_paths.all_products)
               .then((res) => res.json())
               .then((data) => { setallproducts(data) });
     }

     useEffect(() => {
          fetchInfo();
     }, [])

     const remove_product = async (id) => {

          await fetch( `http://localhost:3001/adminremove`, {
               method : 'POST',
               headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
               },
               body : JSON.stringify({id:id}),
          })

          // Swal.fire({
          //      title: "Are you sure?",
          //      text: "Once deleted, you will not be able to recover this product",
          //      icon: 'warning',
          //      showCancelButton: true,
          //      cancelButtonText: 'Cancel',
          //      confirmButtonText: `<i class="fa-solid fa-trash"></i> Logout`,
          //      confirmButtonColor : "#ff4141",
          //      showLoaderOnConfirm : true,
          //      dangerMode: true,
          // })
          //      .then(async (result) => {
          //           if (result.isConfirmed) {

          //                // await fetch(api_paths.remove_product, {
          //                //      method: 'POST',
          //                //      headers: {
          //                //           Accept: 'application/json',
          //                //           'Content-Type': 'application/json',
          //                //      },
          //                //      body: JSON.stringify({ id: id }),
          //                // })
          //                // await fetchInfo();
                         
          //                Swal.fire({
          //                     title : "Product deleted successfully",
          //                     icon: "success",
          //                })

          //           }
          //      })

     }

     return (
          <div className='listproduct'>
               <h1>All Products List</h1>
               <div className="listproduct-format-main">
                    <p>id</p>
                    <p>Products</p>
                    <p>Title</p>
                    <p>Old Price</p>
                    <p>New Price</p>
                    <p>Category</p>
                    <p>Remove</p>
               </div>
               <div className="listproduct-allproducts">
                    <hr />
                    {allproducts.map((product, index) => {
                         return <div key={index} className="listproduct-format-main listproduct-format">
                              <span> {product.id} </span>
                              <img src={product.image} className='listproduct-product-icon' alt="" />
                              <p>{product.name}</p>
                              <p>₹{product.old_price}</p>
                              <p>₹{product.new_price}</p>
                              <p>{product.category}</p>
                              <button onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon fa-solid fa-trash' style={{ color: "#f11e48" }}></button>
                         </div>
                    })}
               </div>
          </div>
     );
}

export default ListProduct;
