import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Store Info
    store: {
        storeName: { type: String, default: 'Shopix' },
        storeEmail: { type: String, default: 'support@shopix.com' },
        storePhone: { type: String, default: '' },
        currency: { type: String, default: 'INR' },
        timezone: { type: String, default: 'Asia/Kolkata' },
        taxRate: { type: Number, default: 18 },
        minOrderAmt: { type: Number, default: 0 },
        freeShipAmt: { type: Number, default: 999 }
    },

    // Appearance
    appearance: {
        theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
        accent: { type: String, default: 'sky' },
        compact: { type: Boolean, default: false }
    },
    notifications: {
        newOrder: { type: Boolean, default: true },
        refundRequest: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true },
        outOfStock: { type: Boolean, default: true },
        newCustomer: { type: Boolean, default: false },
        newReview: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true },
    }
    // Baaki sections (notifications, finance) bhi aage yahan add ho jayenge
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);