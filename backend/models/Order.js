import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String },
            category: { type: String },
            price: { type: Number, required: true }, // new_price at time of order
            quantity: { type: Number, required: true },
        },
    ],
    shipping: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address1: { type: String, required: true },
        address2: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin: { type: String, required: true },
    },
    payment: {
        method: { type: String, enum: ['card', 'upi', 'cod'], required: true },
        last4: { type: String, default: '' },  // last 4 digits if card
        upiId: { type: String, default: '' },
    },
    pricing: {
        subtotal: { type: Number, required: true },
        discountAmt: { type: Number, default: 0 },
        promoCode: { type: String, default: '' },
        discount: { type: Number, default: 0 }, // e.g. 0.10 for 10%
        shippingFee: { type: Number, required: true },
        total: { type: Number, required: true },
    }, 
    payment_status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Refunded'],
        default: 'Unpaid',
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending',
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;