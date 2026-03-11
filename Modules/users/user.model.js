const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },

  role: {
    type: String,
    enum: ["customer", "seller", "admin"],
    default: "customer"
  },

  isActive: { type: Boolean, default: true },
  stripeCustomerId: String,

  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  
  storeName: String,
  storeDescription: String,
  balance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);