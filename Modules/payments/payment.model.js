import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
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
    stripeCheckoutSessionId: String,
    stripePaymentIntentId: String,
    stripeChargeId: String,
    stripeRefundId: String
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);
export default paymentModel;