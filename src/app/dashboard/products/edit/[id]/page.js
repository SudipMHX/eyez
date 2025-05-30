import EditProductClient from "./edit-product-client";

export const metadata = {
  title: "Edit Product",
};

export default function EditProductPage({ params }) {
  const { id } = params;
  return <EditProductClient productId={id} />;
}
