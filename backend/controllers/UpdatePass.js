import Otp from '../models/Otp.js';
import Users from '../models/Users.js';
import bcrypt from 'bcrypt';

const UpdatePass = async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
        return res.status(400).json({ success: false, error: "Password and token are required" });
    }

    try {
        const otpRecord = await Otp.findOne({ 'otp.token': token });
        if (!otpRecord) {
            return res.status(404).json({ success: false, error: "Invalid or expired token" });
        }

        if (new Date(otpRecord.otp.sendtime).getTime() + 5 * 60 * 1000 < Date.now()) {
            return res.status(400).json({ success: false, error: "Session expired" });
        }

        const user = await Users.findOne({ email: otpRecord.email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        otpRecord.otp.token = null;
        otpRecord.otp.sendtime = null;

        await user.save();
        await otpRecord.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ success: false, error: "An internal server error occurred" });
    }
};

export default UpdatePass;