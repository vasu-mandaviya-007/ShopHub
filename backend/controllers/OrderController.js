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
            status: 'placed',
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

export { placeOrder, getUserOrders, getSingleOrder };