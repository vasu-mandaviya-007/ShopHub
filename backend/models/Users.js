// const mongoose = require('mongoose');


// const Users = mongoose.model('Users', {
//      name : {
//           type : String,
//      },
//      email : {
//           type : String,
//           unique : true,
//      },
//      password : {
//           type : String,
//      },
//      cartData : {
//           type : Object,
//      },
//      date : {
//           type : Date,
//           default : Date.now,
//      },
// });

// module.exports = Users;



// import mongoose from "mongoose";

// const Users = mongoose.model('Users', {
//      name: {
//           type: String,
//      },
//      email: {
//           type: String,
//           unique: true,
//      },
//      password: {
//           type: String,
//      },
//      phone: {
//           type: String,
//           default: '',
//      },
//      cartData: {
//           type: Object,
//      },
//      date: {
//           type: Date,
//           default: Date.now,
//      },
// });

// export default Users;


import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
          },
          avatar : {
               type: String,
          },
          email: {
               type: String,
               required: true,
               unique: true,
          },
          password: {
               type: String,
               required: true,
          },
          phone: {
               type: String,
               default: "",
          },
          location: {
               type: String,
               default: "",
          },
          status: {
               type: String,
               enum: ['Active', 'Inactive', 'Blocked'],
               default: 'Active',
          },
          role: {
               type: String,
               enum: ['user', 'admin'],
               default: 'user',
          },
          otp: { type: String, default: null },
          otpExpiry: { type: Date, default: null },
          // E-commerce stats (Usually calculated dynamically from Orders, 
          // but keeping it here to match your frontend structure directly)
          totalOrders: {
               type: Number,
               default: 0,
          },
          totalSpent: {
               type: Number,
               default: 0,
          }
     },
     {
          timestamps: true, // Automatically manages createdAt and updatedAt
     }
);

const Users = mongoose.model("Users", UserSchema);

export default Users;