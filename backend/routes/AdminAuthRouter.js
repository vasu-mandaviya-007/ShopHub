import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Users from '../models/Users.js';
import cloudinary from '../config/cloudinary.js';


const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});



import fetchAdmin from '../middleware/fetchAdmin.js'; // Ise top par import karna mat bhoolna

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 3. GET CURRENT ADMIN PROFILE
router.get('/me', fetchAdmin, async (req, res) => {

    try {

        // Agar demo admin hai, toh database me query karne ki zaroorat nahi
        if (req.user.isDemo) {
            
            await delay(2000);

            return res.json({
                success: true,
                admin: {
                    name: 'Demo Admin',
                    email: 'demo@shopix.com',
                    role: 'admin',
                    isDemo: true
                }
            });
        }

        // Real admin ki details database se nikalo (OTP fields hide karke)
        const admin = await Users.findById(req.user.id).select('-otp -otpExpiry');

        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found.' });
        }
        await delay(2000);
        res.json({ success: true, admin });
    } catch (err) {
        console.error('Fetch Admin Error:', err);
        res.status(500).json({ success: false, error: 'Server error while fetching profile.' });
    }
});


import readOnlyGuard from '../middleware/readOnlyGuard.js'; // Agar import nahi kiya hai toh top pe kar lena
import profileUpload from '../config/profileUpload.js';
import globalSearch from './GlobalSearchController.js';

// ... baaki routes (send-otp, verify-otp, /me)

// 4. UPDATE ADMIN PROFILE
router.put('/update', fetchAdmin, readOnlyGuard, profileUpload.single("avatar"), async (req, res) => {

    try {
        const { name, email, phone, location } = req.body;

        console.log(req?.file?.path)

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and email are required.' });
        }

        // Check karte hain ki naya email kisi aur user/admin ne toh nahi liya hua
        const existingUser = await Users.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'This email is already in use by another account.' });
        }

        // ── STEP 1: Update se pehle purana user nikal lo taaki purani image ka URL mil sake ──
        const currentUser = await Users.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ success: false, error: 'Admin not found.' });
        }
        const oldAvatarUrl = currentUser.avatar;


        const updates = {};
        if (name !== undefined) updates.name = name.trim();
        if (email !== undefined) updates.email = email.trim();
        if (phone !== undefined) updates.phone = phone.trim();
        if (location !== undefined) updates.location = location.trim();

        if (req.file && req.file.path) {
            updates.avatar = req.file.path; // Ye Cloudinary ka direct secure_url hai
        }

        // Admin ki details update karo aur naya data return karo
        const updatedAdmin = await Users.findByIdAndUpdate(
            { _id: req.user.id },
            { $set: updates },
            { new: true } // Ye option ensure karta hai ki updated document return ho
        ).select('-otp -otpExpiry'); // Security ke liye OTP fields hide kar di

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, error: 'Admin not found.' });
        }

        // ── STEP 3: BACKGROUND DELETION (Fire and Forget) ──
        if (req.file && req.file.path && oldAvatarUrl) {
            // URL se public_id nikalne ka logic
            const urlParts = oldAvatarUrl.split('/upload/');
            if (urlParts.length > 1) {
                let pathWithVersion = urlParts[1];
                const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
                const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));

                // ── Yahan se 'await' hata diya aur .then().catch() laga diya ──
                cloudinary.uploader.destroy(publicId)
                    .then(result => console.log(`Old avatar deleted in background: ${publicId}`))
                    .catch(deleteErr => console.error("Failed to delete old avatar:", deleteErr));
            }
        }

        res.json({ success: true, admin: updatedAdmin, message: 'Profile updated successfully.' });

    } catch (err) {
        console.error('Update Admin Error:', err);
        res.status(500).json({ success: false, error: 'Server error while updating profile.' });
    }
});


router.get('/profile', fetchAdmin, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password -otp -otpExpiry');
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ success: true, user });
    } catch (err) {
        console.error('GET /profile/:id:', err);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

// 1. SEND OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        let user = await Users.findOne({ email });

        // 2. Agar email database me nahi hai, toh turant bahar phek do
        if (!user) {
            return res.status(403).json({ success: false, error: 'Access Denied. Email not recognized.' });
        }

        // 3. Agar account hai, par wo ek normal customer hai (role !== 'admin'), toh bhi bahar phek do
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access Denied. You do not have admin privileges.' });
        }

        if (!user) {
            // Testing ke liye: Agar email nahi hai toh naya admin bana do
            user = new Users({
                name: 'Shopix Admin',
                email: email,
                role: 'admin',
                otp: generatedOtp,
                otpExpiry: otpExpiry
            });
        } else {
            user.otp = generatedOtp;
            user.otpExpiry = otpExpiry;
            if (user.role !== 'admin') user.role = 'admin';
        }

        await user.save();

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Shopix Admin - Login OTP',
                html: `<h3>Your Admin Login OTP is: <strong style="color: #0ea5e9;">${generatedOtp}</strong></h3><p>Valid for 10 minutes.</p>`
            });
        } else {
            console.log(`\n🔔 TESTING OTP FOR ${email}: ${generatedOtp}\n`);
        }

        res.json({ success: true, message: 'OTP sent successfully to your email.' });
    } catch (err) {
        console.error('Send OTP Error:', err);
        res.status(500).json({ success: false, error: 'Failed to send OTP.' });
    }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP are required' });

        if (email === 'demo@shopix.com' && otp === '123456') {
            const data = { user: { id: 'demo123', role: 'admin', isDemo: true } };
            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token, role: 'admin', message: 'Demo Login successful.' });
        }

        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

        if (user.otp !== otp) return res.status(400).json({ success: false, error: 'Invalid OTP.' });
        if (new Date() > user.otpExpiry) return res.status(400).json({ success: false, error: 'OTP has expired.' });

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const data = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, role: user.role, message: 'Login successful.' });
    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ success: false, error: 'Failed to verify OTP.' });
    }
});


router.get('/global-search', fetchAdmin, globalSearch);

export default router; 