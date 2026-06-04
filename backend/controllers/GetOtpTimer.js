import Otp from '../models/Otp.js';

const GetOtpTimer = async (req, res) => {
     const { token } = req.body;

     try {
          const finduser = await Otp.findOne({ 'otp.token': token });

          if (!finduser) {
               return res.status(404).json({ success: false, error: 'something went wrong' });
          }

          res.status(200).json({
               success: true,
               sendtime: finduser.otp.sendtime,
          });

     } catch (err) {
          return res.status(500).json({ success: false, error: err.message });
     }
};

export default GetOtpTimer;