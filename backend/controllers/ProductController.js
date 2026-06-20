import Product from '../models/Product.js';

const addproduct = async (req, res) => {

     try {

          let products = await Product.find({});
          let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

          const product = new Product({
               id: id,
               name: req.body.name,
               image: req.body.image,
               category: req.body.category,
               new_price: req.body.new_price,
               old_price: req.body.old_price
          });
          await product.save();
          res.status(200).json({ success: true, name: req.body.name });
     } catch (error) {
          console.error('addproduct error:', error);
          res.status(500).json({ success: false, error: 'Server error' });
     }
};

const remove_product = async (req, res) => {
     try {
          await Product.findOneAndDelete({ id: req.body.id });
          res.status(200).json({ success: true, name: req.body.name });
     } catch (error) {
          console.error('remove_product error:', error);
          res.status(500).json({ success: false, error: 'Server error' });
     }
};

const allproducts = async (req, res) => {
     try {
          // const products = await Product.find({ available: true });
          const products = await Product.find().sort({ id: 1 });

          res.status(200).json({
               success: true,
               products
          });
     } catch (error) {
          console.error("allproducts error:", error);

          res.status(500).json({
               success: false,
               error: "Server error"
          });
     }
};

const popularinwomen = async (req, res) => {
     try {
          let product = await Product.find({ category: "womens" }).limit(4);
          res.status(200).json(product);
     } catch (error) {
          console.error('popularinwomen error:', error);
          res.status(500).json({ success: false, error: 'Server error' });
     }
};

const newcollections = async (req, res) => {
     try {
          const { category } = req.query;
          const filter = {};
          if (category && category !== 'all') {
               filter.category = category.toLowerCase();
          }

          const limit = category && category !== 'all' ? 8 : 40;
          const products = await Product.find(filter).sort({ _id: -1 }).limit(limit);

          res.status(200).json(products);
     } catch (error) {
          console.error('newcollections error:', error);
          res.status(500).json({ success: false, error: 'Server error fetching new collections' });
     }
};

const singleproduct = async (req, res) => {
     try {
          let productid = req.params.productId;
          let product = await Product.findOne({ id: productid });

          if (!product) {
               return res.status(404).json({ success: false, error: "Product not found" });
          }
          res.status(200).json(product);
     } catch (error) {
          console.error('singleproduct error:', error);
          res.status(500).json({ success: false, error: 'Server error' });
     }
};

export { singleproduct, addproduct, remove_product, allproducts, popularinwomen, newcollections };