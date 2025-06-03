import { number } from "framer-motion";
import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Assuming you have a 'Product' model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1."],
    },
    variant: {
      color: String,
      size: String,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, "Unit price cannot be negative."],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative."],
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to your 'User' model
      required: [true, "User ID is required."],
    },
    orderDate: {
      type: Date,
      default: Date.now,
      required: [true, "Order date is required."],
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
      required: [true, "Order status is required."],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required."],
      min: [0, "Total amount cannot be negative."],
    },
    paymentInfo: {
      type: Schema.Types.ObjectId,
      ref: "PaymentInfo", // Reference to your 'PaymentInfo' model
      // required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      name: String,
      email: String,
      number: String,
      address: String,
      city: String,
      zipcode: String,
      region: String,
      country: String,
    },
    shippingFee: {
      type: Number,
      required: [true, ""],
      min: [0, "Shipping fee amount cannot be negative"],
    },
  },
  {
    timestamps: true, // Mongoose will automatically manage createdAt and updatedAt fields
  }
);

// Optional: Pre-save hook to update 'updatedAt' timestamp
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Optional: Indexing for frequently queried fields
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
