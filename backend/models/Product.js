import mongoose from "mongoose";

const Product = mongoose.model('Product', {
     id: {
          type: Number,
          required: true,
     },
     name: {
          type: String,
          required: true,
     },
     image: {
          type: String,
     },
     category: {
          type: String,
          require: true,
     },
     new_price: {
          type: Number,
          require: true,
     },
     old_price: {
          type: Number,
          require: true,
     },
     date: {
          type: Date,
          default: Date.now,
     },
     available: {
          type: Boolean,
          default: true,
     },
})


export default Product;
