import React from 'react';
import './AddProduct.css';
import upload_area from '../../image/upload_area.png';
import SelectBox from '../SelectBox/SelectBox';
import { useState } from 'react';
import api_paths from '../../config/apis';

const AddProduct = () => {

     const [Image, setImage] = useState(false);
     const [productDetails, setproductDetails] = useState({
          name: "",
          image: "",
          category: "womens",
          new_price: "",
          old_price: ""
     });

     const imageHandler = (e) => {
          setImage(e.target.files[0]);
     }

     const changeHandler = (e) => {
          setproductDetails({ ...productDetails, [e.target.name]: e.target.value })
     }

     const Add_Product = async () => {

          let responseData;
          let product = productDetails;
          let formData = new FormData();
          formData.append('product', Image);

          await fetch(api_paths.ImageUpload, {
               method: 'POST',
               headers: {
                    Accept: 'application/json',
               },
               body: formData,

          }).then((resp) => resp.json()).then((data) => { responseData = data });

          if (responseData.success) {
               product.image = responseData.image_url;
               console.log(product);

               // Send This product to /addproduct
               await fetch(api_paths.add_product, {

                    method: 'POST',
                    headers: {
                         Accept: 'application/json',
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
               })
                    .then((resp) => resp.json()
                         .then((data) => {
                              if (data.success) {
                                   navigator.onLine ? swal("Product Added Successfully", { icon: "success", }) : alert("Product Added");
                              }
                              else {
                                   navigator.onLine ? swal("Failed", { icon: "error", }) : alert("Failed")
                              }
                         }))

          }
     }


     return (
          <div className='addproduct'>
               <div className="addproduct-itemfield">
                    <p>Product title</p>
                    <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
               </div>
               <div className="addproduct-price">
                    <div className="addproduct-itemfield">
                         <p>Price</p>
                         <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                    </div>
                    <div className="addproduct-itemfield">
                         <p>Offer Price</p>
                         <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                    </div>
               </div>
               <div className="addproduct-itemfield">
                    <p>Product Category</p>
                    {/* <select name="category" className='add-product-selector'>
                         <option value="men">Men</option>
                         <option value="women">Women</option>
                         <option value="kid">Kids</option>
                    </select> */}
                    <SelectBox />
               </div>
               <div className="addproduct-itemfield">
                    <label htmlFor="file-input">
                         <img src={Image ? URL.createObjectURL(Image) : upload_area} alt="" />
                    </label>
                    <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
               </div>
               <button onClick={() => { Add_Product() }} className='addproduct-btn'>ADD</button>
          </div>
     );
}

export default AddProduct;
