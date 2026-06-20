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
import Product from '../models/Product.js';
import upload from '../config/upload.js';
import cloudinary from '../config/cloudinary.js';
import readOnlyGuard from '../middleware/readOnlyGuard.js';
import fetchAdmin from '../middleware/fetchAdmin.js';
// import { v2 as cloudinary } from "cloudinary"

const router = express.Router();

// Add product 
// router.post('/addproduct', addproduct);

// router.post('/addproduct', fetchAdmin, readOnlyGuard, upload.single('image'), async (req, res) => {

//     try {

//         const { name, category, new_price, old_price, stock, available } = req.body;


//         // Basic validation
//         if (!name?.trim()) return res.status(400).json({ error: 'Product name is required.' });
//         if (!category?.trim()) return res.status(400).json({ error: 'Category is required.' });
//         if (!new_price || Number(new_price) <= 0) return res.status(400).json({ error: 'Valid price is required.' });

//         let products = await Product.find({});
//         let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

//         const product = new Product({
//             id: id,
//             name: name.trim(),
//             category: category.trim().toLowerCase(),
//             new_price: Number(new_price),
//             old_price: Number(old_price) || Number(new_price),
//             stock: Number(stock),
//             image: req.file.path || '',
//             available: available !== undefined ? available : true,
//         });

//         await product.save();

//         res.status(201).json({
//             success: true,
//             message: 'Product added successfully.',
//             product,
//         });

//     } catch (err) {
//         console.error('POST /addproduct:', err);
//         res.status(500).json({ error: 'Failed to add product.' });
//     }
// });


// File ke top par cloudinary import hona chahiye
// import cloudinary from "../config/cloudinary.js"; 

router.post('/addproduct', fetchAdmin, readOnlyGuard, upload.single('image'), async (req, res) => {
    try {
        // req.body me se 'pasted_url' bhi nikal lenge
        const { name, category, new_price, old_price, stock, available, pasted_url } = req.body;

        console.log(pasted_url)

        // Basic validation
        if (!name?.trim()) return res.status(400).json({ error: 'Product name is required.' });
        if (!category?.trim()) return res.status(400).json({ error: 'Category is required.' });
        if (!new_price || Number(new_price) <= 0) return res.status(400).json({ error: 'Valid price is required.' });

        // --- IMAGE HANDLING LOGIC ---
        let finalImageUrl = "";

        if (req.file && req.file.path) {
            // Case 1: User ne physical file upload ki hai (Multer + Cloudinary Storage)
            finalImageUrl = req.file.path;
        } else if (pasted_url && pasted_url.trim() !== "") {
            // Case 2: User ne Image URL paste ki hai
            try {
                const uploadResult = await cloudinary.uploader.upload(pasted_url.trim(), {
                    folder: "ShopHub/products", // Same folder jo multer me diya tha
                });
                finalImageUrl = uploadResult.secure_url;
            } catch (cloudErr) {
                console.error('Cloudinary URL upload failed:', cloudErr);
                return res.status(400).json({ error: 'Failed to process the pasted image URL. Make sure it is a valid image.' });
            }
        }

        // --- ID GENERATION ---
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        // --- SAVE PRODUCT ---
        const product = new Product({
            id: id,
            name: name.trim(),
            category: category.trim().toLowerCase(),
            new_price: Number(new_price),
            old_price: Number(old_price) || Number(new_price),
            stock: Number(stock),
            image: finalImageUrl, // Yahan final processed image URL aayega
            available: available !== undefined ? available : true,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully.',
            product,
        });

    } catch (err) {
        console.error('POST /addproduct:', err);
        res.status(500).json({ error: 'Failed to add product.' });
    }
});

router.put('/update/:id', fetchAdmin, readOnlyGuard, upload.single('image'), async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const { name, category, new_price, old_price, stock, available } = req.body;

        // Build update object
        const updates = {};
        if (name !== undefined) updates.name = name.trim();
        if (category !== undefined) updates.category = category.trim().toLowerCase();
        if (new_price !== undefined) updates.new_price = Number(new_price);
        if (old_price !== undefined) updates.old_price = Number(old_price);
        if (stock !== undefined) updates.stock = Number(stock);
        if (available !== undefined) updates.available = available;


        if (req.file && req.file.path) {
            updates.image = req.file.path; // Ye Cloudinary ka direct secure_url hai
        }


        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        const updated = await Product.findOneAndUpdate(
            { id: productId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: 'Product not found.' });

        res.json({
            success: true,
            message: 'Product updated successfully.',
            product: updated,
        });
    } catch (err) {
        console.error('PUT /update/:id:', err);
        res.status(500).json({ error: 'Failed to update product.' });
    }
});



// Delete Product

router.delete('/delete/:id', fetchAdmin, readOnlyGuard, async (req, res) => {

    try {

        const productId = Number(req.params.id);

        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (product.image && product.image.includes('cloudinary.com')) {
            try {
                // URL se public_id nikalne ka tarika:
                // URL: https://res.cloudinary.com/cloud_name/image/upload/v12345/shopix_products/abcde.jpg
                const urlParts = product.image.split('/');
                const fileNameWithExt = urlParts.pop(); // Isse milega "abcde.jpg"
                const fileName = fileNameWithExt.split('.')[0]; // Isse extension hatega -> "abcde"
                const folderName = urlParts.pop(); // Isse folder ka naam milega -> "shopix_products"

                const publicId = `${folderName}/${fileName}`; // Final: "shopix_products/abcde"

                // Cloudinary se permanently delete karo 
                await cloudinary.uploader.destroy(publicId);
                console.log(`Cloudinary image deleted: ${publicId}`);
            } catch (cloudErr) {
                // Agar Cloudinary pe delete fail bhi ho, toh loop break na ho, hum log kar lenge
                console.error('Failed to delete image from Cloudinary:', cloudErr);
            }
        }

        const deleted = await Product.findOneAndDelete({ id: productId });

        if (!deleted) return res.status(404).json({ error: 'Product not found.' });

        res.json({
            success: true,
            message: `Product "${deleted.name}" deleted successfully.`,
        });

    } catch (err) {

        console.error('DELETE /delete/:id:', err);
        res.status(500).json({ error: 'Failed to delete product.' });

    }

});


// Hide Product

// router.delete('/delete/:id', async (req, res) => {

//     try {

//         const productId = Number(req.params.id);

//         const updatedProduct = await Product.findOneAndUpdate(
//             { id: productId },
//             { $set: { available: false } },
//             { new: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Product not found.'
//             });
//         }

//         res.json({
//             success: true,
//             message: `Product "${updatedProduct.name}" marked as unavailable.`,
//             product: updatedProduct
//         });

//     } catch (err) {
//         console.error('DELETE /delete/:id:', err);

//         res.status(500).json({
//             success: false,
//             error: 'Failed to update product.'
//         });
//     }
// });


// router.get('/:id', async (req, res) => {
//     try {
//         const product = await Product.findOne({ id: Number(req.params.id) });
//         if (!product) return res.status(404).json({ error: 'Product not found.' });
//         res.json(product);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch product.' });
//     }
// });




// Remove product



router.post('/remove_product', remove_product);

// Get all products
// router.get('/allproducts', fetchAdmin, allproducts);
router.get('/allproducts', allproducts);

// Popular in women products
router.get('/popularinwomen', popularinwomen);

// Get Latest Products
router.get('/newcollections', newcollections);

// Get single product details
router.get('/:productId', singleproduct);

export default router;