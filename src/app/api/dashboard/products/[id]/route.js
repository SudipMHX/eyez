import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

import mongoose from "mongoose";
import { authorizeUser } from "@/lib/authorize";

export async function GET(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Product ID format" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Product ID format" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const body = await request.json();

    // To ensure pre-save hooks run (like averageRating), fetch and then save:
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    Object.keys(body).forEach((key) => {
      // Prevent direct update of reviews, averageRating, numReviews from body if managed by hooks/separate endpoints
      if (
        key !== "reviews" &&
        key !== "averageRating" &&
        key !== "numReviews"
      ) {
        product[key] = body[key];
      }
    });

    // If variants are updated, you might need to re-calculate stockQuantity if the hook is off
    // Example: if (body.variants && product.hasVariants) {
    //    product.stockQuantity = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
    //    product.isAvailable = product.stockQuantity > 0;
    // } else if (body.stockQuantity !== undefined) {
    //    product.isAvailable = body.stockQuantity > 0;
    // }

    const updatedProduct = await product.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "Duplicate key error",
          field: Object.keys(error.keyValue)[0],
          value: Object.values(error.keyValue)[0],
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const authResult = await authorizeUser();
  if (!authResult.authorized) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Product ID format" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid Product ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
