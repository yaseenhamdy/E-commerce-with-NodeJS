const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "egp" },
  paymentMethod: {
    type: String,
    enum: ["card", "paypal", "stripe", "cash", "wallet"]
  },
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed", "refunded"],
    default: "pending"
  },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  stripeRefundId: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);