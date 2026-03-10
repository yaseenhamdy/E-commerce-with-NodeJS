const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, min: 0, max: 100 },
  expirationDate: Date,
  usageLimit: { type: Number, min: 0 },
  usageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promocode', promoSchema);