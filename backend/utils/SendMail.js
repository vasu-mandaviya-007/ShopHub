import nodemailer from "nodemailer";

const sendMail = async (otp, email) => {
     try {
          const transport = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
               },
          });

          const mailOptions = {
               from: process.env.MAIL_USER,
               to: email,
               subject: 'Reset Password OTP',
               html: `<div>${otp}</div>`,
          };

          await transport.sendMail(mailOptions);
          return { success: true };

     } catch (err) {
          console.error("MAIL ERROR:", err);
          return { success: false };
     }
};

export default sendMail;
