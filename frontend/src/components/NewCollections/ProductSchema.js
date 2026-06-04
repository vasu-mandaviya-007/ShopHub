const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
     .connect("mongodb://localhost:27017/", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     })
     .then(() => console.log("Connected to MongoDB"))
     .catch((err) => console.error("Connection failed", err));

// Product Schema
const productSchema = new mongoose.Schema({
     id: Number,
     name: String,
     imgUrl: String,
     newPrice: Number,
     oldPrice: Number,
});

const Product = mongoose.model("Product", productSchema);

// Insert Products
async function insertProducts() {
     const products = [
          {
               id: 1,
               name: "Wireless Earbuds",
               imgUrl: "https://example.com/images/earbuds.jpg",
               newPrice: 49.99,
               oldPrice: 59.99,
          },
          {
               id: 2,
               name: "Smart Watch",
               imgUrl: "https://example.com/images/smartwatch.jpg",
               newPrice: 99.99,
               oldPrice: 129.99,
          },
          {
               id: 3,
               name: "Laptop Backpack",
               imgUrl: "https://example.com/images/backpack.jpg",
               newPrice: 39.99,
               oldPrice: 49.99,
          },
          {
               id: 4,
               name: "Bluetooth Speaker",
               imgUrl: "https://example.com/images/speaker.jpg",
               newPrice: 29.99,
               oldPrice: 39.99,
          },
     ];

     try {
          await Product.insertMany(products);
          console.log("Products inserted successfully!");
     } catch (err) {
          console.error("Error inserting products", err);
     } finally {
          mongoose.connection.close();
     }
}

// Fetch Products
async function fetchProducts() {
     try {
          const products = await Product.find(); // Retrieve all products
          products.forEach((product) => {
               const discount = ((product.oldPrice - product.newPrice) / product.oldPrice) * 100;
               console.log({
                    id: product.id,
                    name: product.name,
                    newPrice: product.newPrice,
                    oldPrice: product.oldPrice,
                    discount: `${discount.toFixed(2)}%`,
               });
          });
     } catch (err) {
          console.error("Error fetching products", err);
     } finally {
          mongoose.connection.close(); // Close the connection
     }
}

// Uncomment one of the functions below to use it
// insertProducts(); // Run this once to insert products
fetchProducts(); // Fetch products and calculate discounts
