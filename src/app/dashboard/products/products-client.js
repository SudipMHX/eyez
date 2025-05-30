"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  Tag,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Image from "next/image"; 

import sunglass from "@/assets/sunglasses/01.jpg";

const ProductsClient = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [publishedStatusFilter, setPublishedStatusFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchTerm,
        category: categoryFilter,
        brand: brandFilter,
        stockStatus: stockStatusFilter,
        publishedStatus: publishedStatusFilter,
      });
      const response = await fetch(
        `/api/dashboard/products?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log(errData);
        throw new Error(errData.error || "Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotalProducts(data.pagination.totalProducts);
    } catch (err) {
      setError(err.message);
      console.error("Fetch products error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    limit,
    searchTerm,
    categoryFilter,
    brandFilter,
    stockStatusFilter,
    publishedStatusFilter,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId, productName) => {
    const result = await Swal.fire({
      title: `Delete ${productName}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/dashboard/products/${productId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to delete product.");
        }
        Swal.fire("Deleted!", `${productName} has been deleted.`, "success");
        fetchProducts(); // Refresh the list
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchProducts();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  useEffect(() => {
    // Debounce effect for filters
    const debounceTimer = setTimeout(() => {
      if (!isLoading) handleFilterChange();
    }, 500); // Adjust debounce time as needed
    return () => clearTimeout(debounceTimer);
  }, [categoryFilter, brandFilter, stockStatusFilter, publishedStatusFilter]);

  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className='flex justify-center items-center space-x-2 mt-8'>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className='p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'>
          <ChevronLeft size={20} />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}>
            {number}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || isLoading}
          className='p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'>
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Manage Products
        </h2>
        <Link
          href='/dashboard/products/new'
          className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-150'>
          <PlusCircle size={20} className='mr-2' /> Add New Product
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className='mb-6 p-4 bg-white shadow rounded-lg'>
        <div className='flex flex-col md:flex-row gap-4'>
          <form
            onSubmit={handleSearch}
            className='flex-grow flex items-center border border-gray-300 rounded-lg overflow-hidden'>
            <input
              type='text'
              placeholder='Search products (name, SKU, category...)'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='p-2 w-full outline-none'
            />
            <button
              type='submit'
              className='p-2 bg-blue-500 text-white hover:bg-blue-600'>
              <Search size={20} />
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='p-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100'>
            <Filter size={20} className='mr-1' /> Filters
          </button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <input
                type='text'
                placeholder='Category'
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className='p-2 border border-gray-300 rounded-lg'
              />
              <input
                type='text'
                placeholder='Brand'
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className='p-2 border border-gray-300 rounded-lg'
              />
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className='p-2 border border-gray-300 rounded-lg'>
                <option value=''>All Stock Status</option>
                <option value='inStock'>In Stock</option>
                <option value='outOfStock'>Out of Stock</option>
              </select>
              <select
                value={publishedStatusFilter}
                onChange={(e) => setPublishedStatusFilter(e.target.value)}
                className='p-2 border border-gray-300 rounded-lg'>
                <option value=''>All Publishing Status</option>
                <option value='true'>Published</option>
                <option value='false'>Unpublished</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoading && (
        <div className='flex justify-center items-center h-64'>
          <Loader2 size={48} className='animate-spin text-blue-500' />
        </div>
      )}
      {error && <p className='text-red-500 text-center'>Error: {error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p className='text-gray-500 text-center py-10'>
          No products found. Try adjusting your search or filters.
        </p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Image
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  SKU
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Published
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        // src={product.images[0].src}
                        src={sunglass}
                        alt={product.images[0].alt || product.name || "x"}
                        width={50}
                        height={50}
                        className='rounded object-cover'
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/50x50/e2e8f0/94a3b8?text=No+Img")
                        }
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500'>
                        No Img
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {product.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {product.brand || "N/A"}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product.sku || "N/A"}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    ${product.price.toFixed(2)}
                    {product.compareAtPrice && (
                      <span className='ml-1 text-xs text-gray-400 line-through'>
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {product.stock > 0
                        ? `${product.stock} In Stock`
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product.category}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {product.isPublished ? (
                      <Eye
                        size={18}
                        className='text-green-500'
                        title='Published'
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        className='text-red-500'
                        title='Unpublished'
                      />
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                    <Link
                      href={`/dashboard/products/edit/${product._id}`}
                      className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
                      <Edit3 size={18} className='inline' />
                    </Link>
                    <button
                      onClick={() =>
                        handleDeleteProduct(product._id, product.name)
                      }
                      className='text-red-600 hover:text-red-900 cursor-pointer'>
                      <Trash2 size={18} className='inline' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination />
    </div>
  );
};

export default ProductsClient;
