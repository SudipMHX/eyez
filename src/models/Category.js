import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
});

// Pre-save hook to generate slug from name if not provided
categorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with one
      .trim();
  }
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
