import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
     {
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
          stock: {
               type: Number,
               default: 0
          },
          date: {
               type: Date,
               default: Date.now,
          },
          available: {
               type: Boolean,
               default: true,
          },
     },
     {
          timestamps: true, // adds createdAt & updatedAt
     }
)

/* ── Auto-increment `id` before saving ── */
ProductSchema.pre('save', async function (next) {
     if (this.isNew) {
          const last = await this.constructor.findOne().sort({ id: -1 }).select('id');
          this.id = last ? last.id + 1 : 1;
     }
     next();
});


export default mongoose.model('Product', ProductSchema);
