import mongoose from "mongoose";

const Otp = mongoose.model('Otp', {
     email: {
          type: String,
     },
     otp: {
          otp: { type: String },
          sendtime: { type: Number },
          token: { type: String },
     },
});

export default Otp;