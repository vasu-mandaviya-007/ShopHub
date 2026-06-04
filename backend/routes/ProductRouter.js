// const express = require('express');
// const Product = require('../models/Product');
// const { singleproduct, addproduct, remove_product, allproducts, popularinwomen, newcollections } = require("../controllers/ProductController");

// const router = express.Router();


// // Add product 
// router.post('/addproduct', addproduct);

// // Remove product
// router.post('/remove_product', remove_product);

// // Get all products
// router.get('/allproducts', allproducts);

// // Popular in women products
// router.get('/popularinwomen', popularinwomen);

// // Get Letest Products
// router.get('/newcollections', newcollections);


// router.get('/:productId', singleproduct);

// export default router;



import express from 'express';
import {
    singleproduct,
    addproduct,
    remove_product,
    allproducts,
    popularinwomen,
    newcollections
} from "../controllers/ProductController.js";

const router = express.Router();

// Add product 
router.post('/addproduct', addproduct);

// Remove product
router.post('/remove_product', remove_product);

// Get all products
router.get('/allproducts', allproducts);

// Popular in women products
router.get('/popularinwomen', popularinwomen);

// Get Latest Products
router.get('/newcollections', newcollections);

// Get single product details
router.get('/:productId', singleproduct);

export default router;