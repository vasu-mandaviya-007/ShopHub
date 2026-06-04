import Cart from '../models/Cart.js';

const addtocart = async (req, res) => {
     try {
          const userId = req.user.id;
          const { itemId } = req.body;

          let usercart = await Cart.findOne({ userId });

          if (!usercart) {
               usercart = new Cart({ userId, items: [] });
          }

          const item = usercart.items.find((item) => item.productId === itemId.toString());

          if (item) {
               item.quantity += 1;
          } else {
               usercart.items.push({ productId: itemId, quantity: 1 });
          }

          await usercart.save();
          res.status(200).json({ success: true });
     } catch (error) {
          console.error("AddToCart Error:", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
     }
};

const removefromcart = async (req, res) => {
     try {
          const userId = req.user.id;
          const { itemId } = req.body;

          let usercart = await Cart.findOne({ userId });

          if (!usercart) {
               return res.status(404).json({ success: false, error: "Cart Not Found" });
          }

          const ItemIndex = usercart.items.findIndex((item) => item.productId === itemId.toString());

          if (ItemIndex !== -1) {
               if (usercart.items[ItemIndex].quantity > 1) {
                    usercart.items[ItemIndex].quantity -= 1;
               } else {
                    usercart.items.splice(ItemIndex, 1);
               }
               await usercart.save();
          }

          res.status(200).json({ success: true });
     } catch (error) {
          console.error("RemoveFromCart Error:", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
     }
};

const getcartitem = async (req, res) => {
     try {
          const userId = req.user.id;
          const usercart = await Cart.findOne({ userId });

          if (usercart !== null) {
               res.status(200).json(usercart.items);
          } else {
               res.status(200).json([]); // Send empty array if no cart exists yet
          }
     } catch (error) {
          console.error("GetCartItem Error:", error);
          res.status(500).json({ success: false, error: "Internal Server Error" });
     }
};

export { addtocart, removefromcart, getcartitem };