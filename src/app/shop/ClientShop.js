"use client";
import { useState } from "react";
import "@/styles/shop.css";

import ProductCard from "@/components/ui/ProductCard";

const ClientShop = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
          <div className='fixed inset-0 z-40 bg-opacity-40 flex justify-start md:hidden'>
            <div className='w-11/12 max-w-sm bg-white h-full p-4 overflow-y-auto'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>Filters & Sort</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className='text-sm text-blue-600 font-medium'>
                  Close
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className='mb-6'>
                <label className='block text-sm font-medium mb-2'>
                  Sort By
                </label>
                <select className='w-full px-4 py-2 text-sm rounded-md border border-gray-300 shadow-sm'>
                  <option>Best Selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>

              {/* Filters (reused from desktop) */}
              <div className='space-y-8'>
                {/* Price Filter */}
                <div className='space-y-4 bg-white p-4 rounded-xl shadow-sm border'>
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
                <div className='space-y-4 bg-white p-4 rounded-xl shadow-sm border'>
                  <h3 className='text-lg font-semibold'>Availability</h3>
                  <div className='space-y-3'>
                    {["In Stock", "Pre Order", "Up Coming"].map((label) => (
                      <label
                        key={label}
                        className='flex items-center space-x-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          className='w-3.5 h-3.5 accent-blue-600'
                        />
                        <span className='text-gray-700'>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex max-w-7xl mx-auto'>
          {/* Desktop Filters Sidebar */}
          <aside className='hidden w-72 p-6 pr-4 md:block shrink-0'>
            <div className='sticky top-6 space-y-8'>
              {/* Price Filter */}
              <div className='space-y-4 bg-white p-5 rounded-xl shadow-xs'>
                <h3 className='text-lg font-semibold'>Price Range</h3>
                <input
                  type='range'
                  min='0'
                  max='100000'
                  className='w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range accent-blue-600'
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
              <div className='space-y-4 bg-white p-5 rounded-xl shadow-xs'>
                <h3 className='text-lg font-semibold'>Availability</h3>
                <div className='space-y-3'>
                  {["In Stock", "Pre Order", "Up Coming"].map((label) => (
                    <label
                      key={label}
                      className='flex items-center space-x-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        className='w-3.5 h-3.5 accent-blue-600'
                      />
                      <span className='text-gray-700'>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Desktop Header with Sort */}
            <div className='sticky top-0 z-20 hidden bg-gray-50 bg-opacity-90 backdrop-blur-sm md:block'>
              <div className='flex items-center justify-between p-6 pb-4'>
                <h1 className='text-2xl font-bold tracking-tight'>
                  Sunglasses
                </h1>
                <div className='flex items-center space-x-4'>
                  <select className='px-4 py-2 text-sm rounded-md shadow-sm'>
                    <option>Best Selling</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className='p-2'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-5'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCard key={i} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default ClientShop;
