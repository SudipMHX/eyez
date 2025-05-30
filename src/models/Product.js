import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: { type: Number, default: 0 },
  priceModifier: { type: Number, default: 0 }, // e.g., +5 for XL size
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      // For showing a discounted price, e.g., "was $100, now $80"
      type: Number,
      min: [0, "Compare at price cannot be negative"],
      validate: {
        validator: function (value) {
          return value === null || value === undefined || value > this.price;
        },
        message: "Compare at price must be greater than the actual price.",
      },
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [String],
    images: [
      {
        src: { type: String, required: true },
        alt: String,
      },
    ],
    videos: [
      // Optional video URLs
      {
        src: { type: String },
        title: String,
      },
    ],
    stock: {
      // Overall stock if not using variants, or default stock for variants
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      // Stock Keeping Unit
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls, but unique if value is present
      trim: true,
    },
    variants: [variantSchema], // For products with different colors, sizes, etc.
    isPublished: {
      type: Boolean,
      default: false,
    },
    featured: {
      // To mark a product as featured
      type: Boolean,
      default: false,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    // Add more fields as needed: dimensions, weight, materials, etc.
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: "cm" },
    },
    weight: {
      value: Number,
      unit: { type: String, default: "kg" },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true // Uncomment if you want to enforce this
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug from name if not provided or to ensure it's URL-friendly
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
