import Users from '../models/Users.js';
import bcrypt from 'bcrypt';




const getAllCustomers = async (req, res) => {

    try {
        // Fetching all users who are not admins, sorted by newest first
        const users = await Users.find({ role : "user" }).sort({ createdAt: -1 });

        res.json({
            success: true,
            users: users
        });
    } catch (err) {
        console.error('GET /allusers error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch customers.' });
    }

}

const updateCustomer = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone, status } = req.body;

        const updates = {};
        if (name) updates.name = name.trim();
        if (email) updates.email = email.trim().toLowerCase();
        if (phone !== undefined) updates.phone = phone.trim();
        if (status) updates.status = status;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update.' });
        }

        // Check if the new email is already taken by another user
        if (email) {
            const existingUser = await Users.findOne({ email: updates.email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'Email is already in use by another customer.' });
            }
        }

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'Customer not found.' });
        }

        res.json({
            success: true,
            message: 'Customer updated successfully.',
            user: updatedUser,
        });

    } catch (err) {
        console.error('PUT /admin/update/:id error:', err);
        res.status(500).json({ success: false, error: 'Failed to update customer.' });
    }
}


const deleteCustomer = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await Users.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'Customer not found.' });
        }

        res.json({
            success: true,
            message: 'Customer deleted successfully.',
        });

    } catch (err) {
        console.error('DELETE /admin/delete/:id error:', err);
        res.status(500).json({ success: false, error: 'Failed to delete customer.' });
    }
}




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

export { getProfile, updateProfile, changePassword, getAllCustomers, updateCustomer, deleteCustomer };