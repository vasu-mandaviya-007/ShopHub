// const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const router = express.Router();

// // Image Storage Engine
// const storage = multer.diskStorage({
//      destination: 'upload/images',
//      filename: (req, file, cb) => {
//           return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//      }
// })

// const upload = multer({ storage: storage })

// // Creating Upload Endpoint for images

// router.use('/images', express.static('upload/images'))

// router.post("/upload", upload.single('product'), (req, res) => {
//      res.json({
//           success: 1,
//           image_url: `http://localhost:3001/api/images/${req.file.filename}`
//      })
// })

// module.exports = router;


import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
     destination: 'upload/images',
     filename: (req, file, cb) => {
          return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
     }
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
router.use('/images', express.static('upload/images'));

router.post("/upload", upload.single('product'), (req, res) => {
     // Use dynamic URL for production readiness
     const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
     
     res.status(200).json({
          success: true, // Changed success: 1 to standard boolean
          image_url: `${baseUrl}/api/images/${req.file.filename}`
     });
});

export default router;