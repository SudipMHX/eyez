import mongoose from "mongoose";

const paymentInfoSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Assuming you have an 'Order' model
      required: [true, "Order ID is required."],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a 'User' model
      required: [true, "User ID is required."],
      index: true,
    },
    method: {
      type: String,
      enum: [
        "bKash",
        "Nagad",
        "Rocket",
        "CashOnDelivery",
        // "Card",
        // "BankTransfer",
        // "Other",
      ],
      required: [true, "Payment method is required."],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "failed",
        "cancelled",
        "refunded",
        "processing",
      ],
      required: [true, "Payment status is required."],
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required."],
      min: [0, "Amount cannot be negative."],
    },
    currency: {
      type: String,
      required: [true, "Currency is required."],
      default: "BDT", // Bangladeshi Taka Only
      uppercase: true,
    },
    trxId: {
      type: String,
      trim: true,
      index: true,
      unique: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: [true, "Payment date is required."],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: If you often query by method and status together
paymentInfoSchema.index({ method: 1, status: 1 });
// Optional: If you often query by userId and status
paymentInfoSchema.index({ userId: 1, status: 1 });

export default mongoose.models.PaymentInfo ||
  mongoose.model("PaymentInfo", paymentInfoSchema);
