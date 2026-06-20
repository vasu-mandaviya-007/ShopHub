import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const generateOrderId = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ORD-${ts}-${rand}`;
};

const placeOrder = async (req, res) => {

    try {

        const userId = req.user.id;
        const { items, shipping, payment, pricing } = req.body;

        if (!items?.length) return res.status(400).json({ success: false, error: 'Cart is empty' });
        if (!shipping) return res.status(400).json({ success: false, error: 'Shipping details missing' });
        if (!payment?.method) return res.status(400).json({ success: false, error: 'Payment method missing' });
        if (!pricing?.total) return res.status(400).json({ success: false, error: 'Pricing details missing' });

        const orderId = generateOrderId();

        const order = new Order({
            userId,
            orderId,

            items,
            shipping,

            payment: {
                method: payment.method,
                last4: payment.last4 || '',
                upiId: payment.upiId || '',
            },
            pricing: {
                subtotal: pricing.subtotal,
                discountAmt: pricing.discountAmt || 0,
                promoCode: pricing.promoCode || '',
                discount: pricing.discount || 0,
                shippingFee: pricing.shippingFee,
                total: pricing.total,
            },

            // status: 'placed',
            payment_status: payment.method === 'cod' ? 'Unpaid' : 'Paid', // Basic logic
            status: 'Pending', // FIX: 'placed' ki jagah 'Pending'

        });

        await order.save();

        await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
        );

        res.status(200).json({ success: true, orderId, message: 'Order placed successfully' });
    } catch (error) {
        console.error('placeOrder error:', error);
        res.status(500).json({ success: false, error: 'Failed to place order' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).sort({ placedAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
};

const getSingleOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId, userId });
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('getSingleOrder error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order' });
    }
};



// Admin Controllers

const getAllOrders = async (req, res) => {

    try {
        // Sort by id descending (Newest orders first)
        const orders = await Order.find({}).sort({ id: -1 });
        res.json({
            success: true,
            orders: orders
        });
    } catch (err) {
        console.error('GET /allorders error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
    }

}



// const getAllOrders = async (req, res) => {

//     try {

//         const { search = '', status, page = 1, limit = 20 } = req.query;

//         const filter = {};

//         // ── Search across order id, customer name, email, phone ──
//         if (search.trim()) {
//             const regex = new RegExp(search.trim(), 'i'); // case-insensitive partial match
//             filter.$or = [
//                 { orderId: regex },   // remove this line if you don't have an orderId field
//                 { 'shipping.firstName': regex },
//                 { 'shipping.lastName': regex },
//                 { 'shipping.email': regex },
//                 { 'shipping.phone': regex },
//             ];

//             // If your order id is purely numeric (e.g. `id: 1042`), also try an exact number match:
//             if (!isNaN(search.trim())) {
//                 filter.$or.push({ id: Number(search.trim()) });
//             }
//         }

//         // ── Status filter ──
//         if (status && status !== 'all') {
//             filter.status = status;
//         }

//         const pageNum = Math.max(1, Number(page));
//         const limitNum = Math.min(100, Math.max(1, Number(limit))); // cap at 100 per page
//         const skip = (pageNum - 1) * limitNum;

//         const [orders, total] = await Promise.all([
//             Order.find(filter)
//                 .sort({ id: -1 })          // kept exactly as you had it — newest first
//                 .skip(skip)
//                 .limit(limitNum),
//             Order.countDocuments(filter),
//         ]);

//         res.json({
//             success: true,
//             orders,
//             pagination: {
//                 total,
//                 page: pageNum,
//                 limit: limitNum,
//                 totalPages: Math.ceil(total / limitNum),
//             },
//         });

//     } catch (err) {
//         console.error('GET /allorders error:', err);
//         res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
//     }

// };


const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, payment_status } = req.body;

        const updates = {};
        if (status) updates.status = status;
        if (payment_status) updates.payment_status = payment_status;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update.' });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        res.json({
            success: true,
            message: 'Order updated successfully.',
            order: updatedOrder,
        });

    } catch (err) {
        console.error('PUT /update/:id error:', err);
        res.status(500).json({ success: false, error: 'Failed to update order.' });
    }
};

const deleteOrder = async (req, res) => {

    try {

        const orderId = req.params.id;

        const deletedOrder = await Order.findOneAndDelete({ _id: orderId });

        if (!deletedOrder) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully.',
        });

    } catch (err) {
        console.error('DELETE /delete/:id error:', err);
        res.status(500).json({ success: false, error: 'Failed to delete order.' });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch order.' });
    }
}


const addDummyOrder = async (req, res) => {
    try {
        const newOrder = new Order({
            customer_name: 'Vasu Mandaviya',
            customer_email: 'vasu@example.com',
            total_amount: 14500,
            payment_status: 'Paid',
            status: 'Processing'
        });
        await newOrder.save();
        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export { placeOrder, getUserOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder, addDummyOrder, getOrder };