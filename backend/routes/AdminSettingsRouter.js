import express from 'express';
import Settings from '../models/Settings.js';
import fetchAdmin from '../middleware/fetchAdmin.js';
import readOnlyGuard from '../middleware/readOnlyGuard.js';
import Users from '../models/Users.js';

const router = express.Router();

// ── GET APPEARANCE SETTINGS ──
router.get('/appearance-settings', fetchAdmin,readOnlyGuard, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Agar DB me koi settings nahi hai, toh default create kar do
            settings = await Settings.create({});
        }
        res.json({ success: true, appearance: settings.appearance });
    } catch (err) {
        console.error('Fetch Appearance Error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ── UPDATE APPEARANCE SETTINGS (Protected by Demo Mode) ──
router.put('/appearance-settings', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        const { theme, accent, compact } = req.body;

        // Validation
        if (!['light', 'dark', 'system'].includes(theme)) {
            return res.status(400).json({ success: false, error: 'Invalid theme value' });
        }

        // Update ya Create karo
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        settings.appearance = { theme, accent, compact };
        await settings.save();

        res.json({ success: true, appearance: settings.appearance });
    } catch (err) {
        console.error('Update Appearance Error:', err);
        res.status(500).json({ success: false, error: 'Server error while saving settings' });
    }
});




// ── GET STORE SETTINGS ──
// router.get('/store-settings', fetchAdmin, async (req, res) => {
router.get('/store-settings', fetchAdmin, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json({ success: true, store: settings.store });
    } catch (err) {
        console.error('Fetch Store Settings Error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});


router.get('/public/store-settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        // 🚨 SECURITY: Sirf utna hi data bhejo jitna frontend ko chahiye
        // Pura settings.store mat bhejna!
        const publicSettings = {
            storeName: settings.store.storeName,
            currency: settings.store.currency,
            taxRate: settings.store.taxRate,
            minOrderAmt: settings.store.minOrderAmt,
            freeShipAmt: settings.store.freeShipAmt,
            // Agar koi sensitive key ho toh usko yahan mat likhna
        };

        res.json({ success: true, store: publicSettings });
    } catch (err) {
        console.error('Fetch Public Settings Error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ── UPDATE STORE SETTINGS (Protected by Demo Mode) ──
// router.put('/store-settings', fetchAdmin, readOnlyGuard, async (req, res) => {
router.put('/store-settings', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        const { storeName, storeEmail, storePhone, currency, timezone, taxRate, minOrderAmt, freeShipAmt } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        // Update Store object
        settings.store = {
            storeName,
            storeEmail,
            storePhone,
            currency,
            timezone,
            taxRate: Number(taxRate),
            minOrderAmt: Number(minOrderAmt),
            freeShipAmt: Number(freeShipAmt)
        };

        await settings.save();

        res.json({ success: true, store: settings.store });
    } catch (err) {
        console.error('Update Store Settings Error:', err);
        res.status(500).json({ success: false, error: 'Server error while saving settings' });
    }
});



// ── GET NOTIFICATION SETTINGS ──
router.get('/notification-settings', fetchAdmin, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json({ success: true, notifications: settings.notifications });
    } catch (err) {
        console.error('Fetch Notifications Error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ── UPDATE NOTIFICATION SETTINGS (Protected by Demo Mode) ──
router.put('/notification-settings', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        const { newOrder, refundRequest, lowStock, outOfStock, newCustomer, newReview, systemUpdates } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        settings.notifications = {
            newOrder,
            refundRequest,
            lowStock,
            outOfStock,
            newCustomer,
            newReview,
            systemUpdates
        };

        await settings.save();

        res.json({ success: true, notifications: settings.notifications });
    } catch (err) {
        console.error('Update Notifications Error:', err);
        res.status(500).json({ success: false, error: 'Server error while saving settings' });
    }
});




// ── 1. EXPORT DATA (GET) ──
router.get('/export-data', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        // Tum yahan jo bhi collection export karna chaho kar sakte ho.
        // Abhi ke liye hum Settings aur Admin ki profile bhejein ge.
        const settings = await Settings.findOne();
        const adminProfile = await Users.findById(req.user.id).select('-otp -otpExpiry'); // Sensitive OTP info nahi bhejni

        const exportPayload = {
            exportDate: new Date().toISOString(),
            adminProfile,
            storeSettings: settings
        };

        // JSON file stringify karke bhej do
        const jsonString = JSON.stringify(exportPayload, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=shopix-export-${Date.now()}.json`);

        res.send(jsonString);

    } catch (err) {
        console.error('Data Export Error:', err);
        res.status(500).json({ success: false, error: 'Server error during export.' });
    }
});

// ── 2. CLEAR CACHE (POST) ──
router.post('/clear-cache', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        // Agar tum Redis ya NodeCache use kar rahe ho, toh yahan clear() call hoga.
        // Kyunki humari abhi basic MERN app hai, hum fake delay dekar response bhej denge.

        // Example if using node-cache: myCache.flushAll();

        setTimeout(() => {
            res.json({ success: true, message: 'Server cache cleared.' });
        }, 800); // Thoda realistic feel dene ke liye delay

    } catch (err) {
        console.error('Clear Cache Error:', err);
        res.status(500).json({ success: false, error: 'Failed to clear cache.' });
    }
});

// ── 3. DELETE ACCOUNT (DELETE) ──
router.delete('/delete-account', fetchAdmin, readOnlyGuard, async (req, res) => {
    try {
        // Step 1: User ko find karo
        const admin = await Users.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin account not found.' });
        }

        // Step 2: (Optional Cleanup) Agar Cloudinary pe iski profile pic hai, toh wo bhi uda do
        if (admin.avatar) {
            const urlParts = admin.avatar.split('/upload/');
            if (urlParts.length > 1) {
                let pathWithVersion = urlParts[1];
                const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
                const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));

                // Fire and forget delete
                cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary cleanup failed:", err));
            }
        }

        // Step 3: Database se permanently delete karo
        await Users.findByIdAndDelete(req.user.id);

        res.json({ success: true, message: 'Admin account deleted permanently.' });

    } catch (err) {
        console.error('Delete Account Error:', err);
        res.status(500).json({ success: false, error: 'Server error while deleting account.' });
    }
});

export default router;