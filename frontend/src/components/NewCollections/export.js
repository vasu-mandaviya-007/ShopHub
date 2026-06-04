const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  imgUrl: String,
  newPrice: Number,
  oldPrice: Number,
});

const Product = mongoose.model('Product', productSchema);

async function exportData() {
  try {
    const products = await Product.find();
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    console.log('Data exported to products.json');
  } catch (err) {
    console.error('Error exporting data:', err);
  } finally {
    mongoose.connection.close();
  }
}

exportData();
