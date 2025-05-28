import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone_number: String,
    password: String,
    role: {
      type: String,
      default: "user",
    },
    preferences: {
      promotionalEmails: { type: Boolean, default: true },
      promotionalMessages: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: true },
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    termsAcceptedAt: {
      type: Date,
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
