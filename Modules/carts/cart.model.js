import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: { type: Number, default: 1 },
      price: Number
    }
  ],
  totalPrice: Number
}, { timestamps: true });


export const cartModel = mongoose.model('Cart', cartSchema);