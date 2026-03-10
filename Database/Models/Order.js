const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" 
      },
      seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      },
      name: String,
      price: Number,
      quantity: Number,
      itemStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "canceled"],
        default: "pending"
      }
    }
  ],

  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "canceled"],
    default: "pending"
  },

  shippingAddress: {
    city: String,
    street: String,
    phone: String
  },
  appliedPromo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Promocode" 
  },
  discountAmount: { type: Number, default: 0 },
  subtotal: Number,
  tax: Number,
  shippingFee: { type: Number, default: 50 },
  total: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);