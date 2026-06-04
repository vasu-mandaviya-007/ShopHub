import mongoose from "mongoose";

const Cart = mongoose.model("Cart" , {
     userId : String,
     items : [
          {
               productId : String,
               quantity : Number,
          },
     ],
});

export default Cart;