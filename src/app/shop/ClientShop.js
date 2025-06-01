"use client";
import { useState, useEffect, useCallback } from "react";
import "@/styles/shop.css";

import ProductCard from "@/components/ui/ProductCard"; 

const ClientShop = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("");

  // sort data
  const [sortType, setSortType] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);
      if (selectedStockStatus)
        params.append("stockStatus", selectedStockStatus);
      if (sortType) {
        params.append("sortType", sortType);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedStockStatus,
    sortType,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleCheckboxFilterChange = (value) => {
    setSelectedStockStatus((prevStatus) => {
      const newStatus = prevStatus === value ? "" : value;
      setCurrentPage(1); // Reset to page 1
      return newStatus;
    });
  };

  const handleSearchDebounced = useCallback((searchFn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        searchFn(...args);
      }, delay);
    };
  }, []);

  const debouncedSearch = handleSearchDebounced((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 500); // 500ms debounce

  const handleSearchInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const renderFilters = (isMobile = false) => (
    <div className={isMobile ? "space-y-8" : "sticky top-6 space-y-8"}>
      {/* Search Filter */}
      <div
        className={`space-y-4 bg-white p-4 rounded-xl shadow-sm ring ring-blue-200 ${
          isMobile ? "" : "md:p-5 md:shadow-xs"
        }`}>
        <h3 className='text-lg font-semibold'>Search Products</h3>
        <input
          type='text'
          placeholder='Search by name...'
          defaultValue={searchTerm}
          onChange={handleSearchInputChange}
          className='w-full px-4 py-2 text-sm rounded-md ring ring-blue-200 shadow-sm'
        />
      </div>

      {/* Category Filter (Example: Text Input) */}
      <div
        className={`space-y-4 bg-white p-4 rounded-xl shadow-sm ring ring-blue-200 ${
          isMobile ? "" : "md:p-5 md:shadow-xs"
        }`}>
        <h3 className='text-lg font-semibold'>Category</h3>
        <input
          type='text'
          placeholder='Enter category'
          value={selectedCategory}
          onChange={handleFilterChange(setSelectedCategory)}
          className='w-full px-4 py-2 text-sm rounded-md ring ring-blue-200 shadow-sm'
        />
      </div>

      {/* Brand Filter (Example: Text Input) */}
      <div
        className={`space-y-4 bg-white p-4 rounded-xl shadow-sm ring ring-blue-200 ${
          isMobile ? "" : "md:p-5 md:shadow-xs"
        }`}>
        <h3 className='text-lg font-semibold'>Brand</h3>
        <input
          type='text'
          placeholder='Enter brand'
          value={selectedBrand}
          onChange={handleFilterChange(setSelectedBrand)}
          className='w-full px-4 py-2 text-sm rounded-md ring ring-blue-200 shadow-sm'
        />
      </div>

      {/* Price Filter (UI only, not connected to API) */}
      <div
        className={`space-y-4 bg-white p-4 rounded-xl shadow-sm ring ring-blue-200 ${
          isMobile ? "" : "md:p-5 md:shadow-xs"
        }`}>
        <h3 className='text-lg font-semibold'>Price Range</h3>
        <input
          type='range'
          min='0'
          max='100000'
          className='w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600'
        />
        <div className='flex justify-between text-sm'>
          <input
            className='w-20 bg-gray-200 p-2 text-center no-spinner rounded-md'
            type='number'
            defaultValue={0}
          />
          <input
            className='w-20 bg-gray-200 p-2 text-center no-spinner rounded-md'
            type='number'
            defaultValue={100000}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div
        className={`space-y-4 bg-white p-4 rounded-xl shadow-sm ring ring-blue-200 ${
          isMobile ? "" : "md:p-5 md:shadow-xs"
        }`}>
        <h3 className='text-lg font-semibold'>Availability</h3>
        <div className='space-y-3'>
          {["In Stock", "Pre Order", "Up Coming"].map((label) => (
            <label
              key={label}
              className='flex items-center space-x-3 cursor-pointer'>
              <input
                type='checkbox'
                value={label}
                checked={selectedStockStatus === label}
                onChange={() => handleCheckboxFilterChange(label)}
                className='w-3.5 h-3.5 accent-blue-600'
              />
              <span className='text-gray-700'>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className='min-h-screen bg-gray-50'>
        {/* Mobile Filters Button */}
        <div className='sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-sm md:hidden'>
          <div className='flex items-center justify-between p-4 border-b'>
            <h1 className='text-xl font-bold'>Sunglasses</h1>
            <button
              onClick={() => setShowMobileFilters(true)}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg'>
              Open Filters
            </button>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className='fixed inset-0 z-[99] bg-opacity-40 flex justify-start md:hidden'>
            {" "}
            {/* Added bg-black for better overlay */}
            <div className='w-11/12 max-w-sm bg-white h-full p-4 overflow-y-auto'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>Filters & Sort</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className='text-sm text-blue-600 font-medium'>
                  Close
                </button>
              </div>
              {/* Sort Dropdown (UI only) */}
              <div className='mb-6'>
                <label className='block text-sm font-medium mb-2'>
                  Sort By
                </label>
                <select
                  onChange={(e) => setSortType(e.target.value)}
                  className='w-full px-4 py-2 text-sm rounded-md border border-gray-300 shadow-sm'>
                  <option disabled>Best Selling</option>
                  <option value='newest'>Newest</option>
                  <option value='price-asc'>Price: Low to High</option>
                  <option value='price-desc'>Price: High to Low</option>
                </select>
              </div>
              {renderFilters(true)}
            </div>
          </div>
        )}

        <div className='flex max-w-7xl mx-auto'>
          {/* Desktop Filters Sidebar */}
          <aside className='hidden w-72 p-6 pr-4 md:block shrink-0'>
            {renderFilters(false)}
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Desktop Header with Sort */}
            <div className='sticky top-0 z-20 hidden bg-gray-50 bg-opacity-90 backdrop-blur-sm md:block'>
              <div className='flex items-center justify-between p-6 pb-4'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Sunglasses
                </h2>
                <div className='flex items-center space-x-4'>
                  <select
                    onChange={(e) => setSortType(e.target.value)}
                    className='px-4 py-2 text-sm rounded-md shadow-sm'>
                    <option disabled>Best Selling</option>
                    <option value='newest'>Newest</option>
                    <option value='price-asc'>Price: Low to High</option>
                    <option value='price-desc'>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className='p-2'>
              {loading && (
                <p className='text-center py-10'>Loading products...</p>
              )}
              {error && (
                <p className='text-center py-10 text-red-500'>Error: {error}</p>
              )}
              {!loading && !error && products.length === 0 && (
                <p className='text-center py-10'>No products found.</p>
              )}
              {!loading && !error && products.length > 0 && (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-5'>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                    /> // Ensure ProductCard uses a unique key and receives product data
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className='flex justify-center items-center space-x-4 py-8 [&>button]:cursor-pointer'>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={pagination.currentPage === 1}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg disabled:opacity-50'>
                  Previous
                </button>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg disabled:opacity-50'>
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default ClientShop;
