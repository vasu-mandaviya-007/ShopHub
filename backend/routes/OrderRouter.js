// const express = require('express');
// const jwt     = require('jsonwebtoken');
// const { placeOrder, getUserOrders, getSingleOrder } = require('../controllers/OrderController');

// const router = express.Router();

// // ── Same fetchuser middleware you use in CartRouter ───────────────────────────
// const fetchuser = (req, res, next) => {
//   const token = req.header('auth-token');
//   if (!token) {
//     return res.status(401).json({ error: 'Please login first' });
//   }
//   try {
//     const data = jwt.verify(token, 'secret_ecom');
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Please authenticate using a valid token' });
//   }
// };

// // ── Routes ────────────────────────────────────────────────────────────────────

// // Place a new order  →  POST /orders/place
// router.post('/place', fetchuser, placeOrder);

// // Get all orders for logged-in user  →  GET /orders/myorders
// router.get('/myorders', fetchuser, getUserOrders);

// // Get single order by orderId  →  GET /orders/:orderId
// router.get('/:orderId', fetchuser, getSingleOrder);

// export default router;



import express from 'express';
import { placeOrder, getUserOrders, getSingleOrder } from '../controllers/OrderController.js';
import fetchuser from '../middleware/fetchuser.js'; // Clean and centralized

const router = express.Router();

// ── Routes ────────────────────────────────────────────────────────────────────

// Place a new order  →  POST /orders/place
router.post('/place', fetchuser, placeOrder);

// Get all orders for logged-in user  →  GET /orders/myorders
router.get('/myorders', fetchuser, getUserOrders);

// Get single order by orderId  →  GET /orders/:orderId
router.get('/:orderId', fetchuser, getSingleOrder);

export default router;