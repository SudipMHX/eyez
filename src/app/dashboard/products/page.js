import ProductsClient from "./products-client";

export const metadata = {
  title: "Manage Products",
  description: "Add, edit, and manage all products.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
