import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    number: String,
    address: String,
    city: String,
    zipcode: String,
    region: String,
    country: String,
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
