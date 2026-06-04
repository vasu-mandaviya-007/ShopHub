import mongoose, { model,module,Schema } from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
     id: Number,
     name: String,
     imgUrl: String,
     newPrice: Number,
     oldPrice: Number,
});


module.exports = mongoose.model('Product', productSchema);
