import express from 'express';
import Order from '../models/Order.js';


const router = express.Router();

/* ════════════════════════════════════════════════
   GET  /orders/allorders
   Returns all orders, newest first
════════════════════════════════════════════════ */
router.get('/allorders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ placedAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('GET /allorders:', err);
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});


/* ════════════════════════════════════════════════
   GET  /orders/:id    (single order)
════════════════════════════════════════════════ */
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch order.' }); 
    }
});


/* ════════════════════════════════════════════════
   POST  /orders/place
   Body: { userId, items, shipping, payment, pricing }
   Called from the frontend checkout flow
════════════════════════════════════════════════ */
router.post('/place', async (req, res) => {
    try {
        const { userId, items, shipping, payment, pricing } = req.body;

        /* Basic validation */
        if (!userId) return res.status(400).json({ error: 'userId is required.' });
        if (!items?.length) return res.status(400).json({ error: 'Order must have at least one item.' });
        if (!shipping?.firstName) return res.status(400).json({ error: 'Shipping info is required.' });
        if (!payment?.method) return res.status(400).json({ error: 'Payment method is required.' });
        if (!pricing?.total) return res.status(400).json({ error: 'Pricing info is required.' });

        const order = new Order({ userId, items, shipping, payment, pricing });
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            order,
        });
    } catch (err) {
        console.error('POST /place:', err);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});


/* ════════════════════════════════════════════════
   PUT  /orders/update/:id
   Body: { status }
   Admin-only — update order status
════════════════════════════════════════════════ */
router.put('/update/:id', async (req, res) => {
    try {
        const { status } = req.body;

        const VALID = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
        if (!VALID.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID.join(', ')}` });
        }

        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: 'Order not found.' });

        res.json({
            success: true,
            message: `Order status updated to "${status}".`,
            order: updated,
        });
    } catch (err) {
        console.error('PUT /update/:id:', err);
        res.status(500).json({ error: 'Failed to update order.' });
    }
});


/* ════════════════════════════════════════════════
   DELETE  /orders/delete/:id
   Admin-only — delete an order
════════════════════════════════════════════════ */
router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Order not found.' });

        res.json({
            success: true,
            message: `Order "${deleted.orderId}" deleted successfully.`,
        });
    } catch (err) {
        console.error('DELETE /delete/:id:', err);
        res.status(500).json({ error: 'Failed to delete order.' });
    }
});


/* ════════════════════════════════════════════════
   GET  /orders/user/:userId
   Returns all orders for a specific user (for user dashboard)
════════════════════════════════════════════════ */
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ placedAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user orders.' });
    }
});


export default router;