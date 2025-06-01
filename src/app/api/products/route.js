import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    await dbConnect();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query = {};

    // Add filters if they exist
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const stockStatus = searchParams.get("stockStatus") || "";

    // ---- for data sorting
    const sortType = searchParams.get("sortType" || "");

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }

    let sort = { createdAt: -1 };
    switch (sortType) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("category")
      .select(
        "-seo -dimensions -description -tags -videos -variants -__v -weight"
      );

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json(
      {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
