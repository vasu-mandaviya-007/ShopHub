import Users from '../models/Users.js';
import bcrypt from 'bcrypt';

// ── GET /account/profile ──────────────────────────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        console.error('getProfile error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// ── POST /account/update ──────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const updates = {};
        if (name?.trim()) updates.name = name.trim();
        if (phone?.trim()) updates.phone = phone.trim();

        const user = await Users.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, select: '-password' }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// ── POST /account/changepassword ──────────────────────────────────────────────
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword)
            return res.status(400).json({ success: false, error: 'Both fields are required' });

        if (newPassword.length < 6)
            return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });

        const user = await Users.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match)
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('changePassword error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export { getProfile, updateProfile, changePassword };