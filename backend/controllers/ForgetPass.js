import Otp from '../models/Otp.js';
import Users from '../models/Users.js';
import crypto from 'crypto';
import sendMail from '../utils/SendMail.js';

const ForgetPass = async (req, res) => {
     try {
          const findEmail = await Users.findOne({ email: req.body.email });

          if (!findEmail) {
               return res.status(404).json({ success: false, error: "Email does not exist" });
          }

          let check = await Otp.findOne({ email: req.body.email });

          if (!check) {
               check = new Otp({
                    email: req.body.email,
                    otp: { otp: null, sendtime: null, token: null },
               });
          }

          if (check.otp.otp && check.otp.sendtime && check.otp.sendtime > Date.now()) {
               const waitTime = new Date(check.otp.sendtime).toLocaleTimeString();
               return res.status(429).json({
                    success: false,
                    error: `Please wait until ${waitTime} to request another OTP`,
               });
          }

          const otp1 = Math.floor(Math.random() * 900000) + 100000;
          const token = crypto.randomBytes(32).toString("hex");

          check.otp.otp = otp1;
          check.otp.sendtime = Date.now() + 60 * 1000;
          check.otp.token = token;

          await check.save();

          const result = await sendMail(otp1, req.body.email);

          if (!result.success) {
               return res.status(500).json({ success: false, error: "Failed to send mail" });
          }

          res.status(200).json({
               success: true,
               message: "OTP sent successfully",
               token,
          });

     } catch (error) {
          console.error("Error in ForgetPass:", error);
          res.status(500).json({ success: false, error: "An internal server error occurred" });
     }
};

export default ForgetPass;