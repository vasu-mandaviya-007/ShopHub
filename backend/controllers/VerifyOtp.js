import Otp from '../models/Otp.js';

const VerifyOtp = async (req, res) => {
     const { otp } = req.body;

     try {
          const finduser = await Otp.findOne({ 'otp.otp': otp });

          if (!finduser) {
               return res.status(404).json({ success: false, error: 'Invalid OTP' });
          }

          if (new Date(finduser.otp.sendtime).getTime() < Date.now()) {
               return res.status(400).json({ success: false, error: 'OTP has expired' });
          }

          finduser.otp.otp = null;
          await finduser.save();

          res.status(200).json({
               success: true,
               message: 'OTP verified successfully',
          });

     } catch (err) {
          console.error('Error verifying OTP:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
     }
};

export default VerifyOtp;