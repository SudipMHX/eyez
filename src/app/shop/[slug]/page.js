import ProductDetailsClient from "./product-details-client";

// Function to fetch your product data (server-side)
async function getProductData(slug) {
  if (!slug) {
    console.error("Slug is undefined.");
    return null;
  }

  console.log("Fetching product for slug:", slug);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `Failed to fetch product ${slug}: ${res.status} - ${errorText}`
    );
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch product data for slug: ${slug}`);
  }

  return res.json();
}

// Dynamic metadata generation (runs on the server)
export async function generateMetadata({ params }) {
  const product = await getProductData(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  return {
    title: product.seo?.title || product.name || "Product Details",
    description:
      product.seo?.description ||
      product.shortDescription ||
      "Check out this amazing product.",
    keywords: product.seo?.keywords || [],
    openGraph: {
      title: product.seo?.title || product.name,
      description: product.seo?.description || product.shortDescription,
      images: product.images?.length
        ? [
            {
              url: product.images[0].src.startsWith("http")
                ? product.images[0].src
                : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                    product.images[0].src
                  }`,
              alt: product.images[0].alt || product.name,
            },
          ]
        : [],
      type: "website",
    },
  };
}

// The Page component (Server Component)
export default async function ProductDetailsPage({ params }) {
  const productData = await getProductData(params.slug);

  if (!productData) {
    return <div>Product not found.</div>;
  }

  return <ProductDetailsClient productData={productData} />;
}
