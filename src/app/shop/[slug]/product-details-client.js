"use client"; // Still needed if you're using App Router and this is a Client Component

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
// If using App Router and this is a Client Component, you'd get params differently,
// e.g., `const params = useParams(); const id = params.id;`
// but for Pages Router, useRouter is correct.
import Head from "next/head";
import ReactPlayer from "react-player/lazy"; // Lazy load for better performance
import Breadcrumbs from "@/components/ui/Breadcrumbs"; // Assuming this component exists
import Link from "next/link";
import { useParams } from "next/navigation";

const ProductDetailsClient = ({ productData }) => {
  const { slug } = useParams();

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Variant States
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  // Memoize media items based on productData
  const mediaItems = useMemo(() => {
    if (!productData) return [];
    const videos =
      productData.videos?.map((v) => ({
        type: "video",
        src: v.src,
        title: v.title,
        alt: v.title,
      })) || [];
    const images =
      productData.images?.map((img) => ({
        type: "image",
        src: img.src,
        alt: img.alt,
      })) || [];
    return [...videos, ...images];
  }, [productData]);

  // Handle variant selection
  useEffect(() => {
    if (productData && productData.variants && selectedColor && selectedSize) {
      const variant = productData.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      setCurrentVariant(variant || null); // Fallback to null if variant not found
      if (variant) {
        setCurrentPrice(productData.price + (variant.priceModifier || 0));
      } else {
        // Handle case where specific color/size combo doesn't exist,
        // or reset to base price if no valid variant.
        // This logic might need adjustment based on desired UX.
        setCurrentPrice(productData.price);
      }
    }
  }, [selectedColor, selectedSize, productData]);

  // Derive available colors and sizes from variants
  const availableColors = useMemo(() => {
    if (!productData || !productData.variants) return [];
    return [...new Set(productData.variants.map((v) => v.color))];
  }, [productData]);

  const availableSizesForSelectedColor = useMemo(() => {
    if (!productData || !productData.variants || !selectedColor) return [];
    return productData.variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
  }, [productData, selectedColor]);

  // Effect to auto-select a valid size when color changes
  useEffect(() => {
    if (selectedColor && availableSizesForSelectedColor.length > 0) {
      if (!availableSizesForSelectedColor.includes(selectedSize)) {
        setSelectedSize(availableSizesForSelectedColor[0]);
      }
    }
  }, [selectedColor, availableSizesForSelectedColor, selectedSize]);

  const openLightbox = (index) => {
    setSelectedMediaIndex(index);
    setShowLightbox(true);
  };

  const selectedMedia = mediaItems[selectedMediaIndex];
  const isVideo = selectedMedia && selectedMedia.type === "video";

  const isCurrentVariantOutOfStock = currentVariant
    ? currentVariant.stock <= 0
    : productData.stock <= 0;
  return (
    <>
      <div className='p-6 max-w-7xl mx-auto'>
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            // {
            //   label: productData.category?.name || "",
            //   href: `/shop?category=${productData.category?.slug}`,
            // },
            { label: productData.name },
          ]}
        />

        <div className='grid md:grid-cols-2 gap-8 mt-6'>
          {/* Media Carousel */}
          <div className='space-y-4'>
            <div className='rounded-xl overflow-hidden h-[350px] md:h-[450px] bg-gray-100 flex items-center justify-center shadow-lg'>
              {selectedMedia ? (
                isVideo ? (
                  <ReactPlayer
                    url={selectedMedia.src}
                    controls
                    width='100%'
                    height='100%'
                    playing={selectedMediaIndex === 0} // Autoplay first video perhaps
                  />
                ) : (
                  <div
                    className='relative w-full h-full cursor-pointer'
                    onClick={() => openLightbox(selectedMediaIndex)}>
                    <Image
                      src={selectedMedia.src}
                      alt={selectedMedia.alt || productData.name}
                      fill
                      className='object-contain rounded-xl'
                      priority={selectedMediaIndex === 0} // Prioritize loading the initially visible image
                    />
                  </div>
                )
              ) : (
                <div className='text-gray-500'>No media available</div>
              )}
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-2'>
                {mediaItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedMediaIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-400"
                    } cursor-pointer bg-white flex items-center justify-center shadow`}>
                    {item.type === "video" ? (
                      <div className='text-xs text-center text-gray-600 p-1 flex flex-col items-center justify-center h-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-6 h-6 mb-1'>
                          <path d='M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm10.974 8.51-4.933 2.848a.75.75 0 0 1-1.121-.65V8.791a.75.75 0 0 1 1.121-.651l4.933 2.847a.75.75 0 0 1 0 1.3Z' />
                        </svg>
                        Video
                      </div>
                    ) : (
                      <div className='relative w-full h-full'>
                        <Image
                          src={item.src}
                          alt={item.alt || `Thumbnail ${index + 1}`}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showLightbox && selectedMedia && !isVideo && (
              <div
                className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]'
                onClick={() => setShowLightbox(false)}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLightbox(false);
                  }}
                  className='absolute top-4 right-4 text-white text-3xl z-[101]'>
                  &times;
                </button>
                <div
                  className='relative w-full max-w-3xl h-[80vh] p-4'
                  onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={selectedMedia.src}
                    alt={selectedMedia.alt || "Lightbox Preview"}
                    fill
                    className='object-contain rounded-xl'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold mb-2 text-gray-800'>
              {productData.name}
            </h1>
            {productData.brand && (
              <p className='text-sm text-gray-500 mb-2'>
                Brand:{" "}
                <Link
                  href={`/shop?brand=${productData.brand
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className='text-blue-600 hover:underline'>
                  {productData.brand}
                </Link>
              </p>
            )}

            <div className='flex items-baseline space-x-2 mb-3'>
              <span className='text-2xl font-semibold text-green-600'>
                ${currentPrice.toFixed(2)}
              </span>
              {productData.compareAtPrice &&
                productData.compareAtPrice > currentPrice && (
                  <span className='text-md text-gray-500 line-through'>
                    ${productData.compareAtPrice.toFixed(2)}
                  </span>
                )}
            </div>

            <p className='text-sm text-gray-600 mb-4'>
              {productData.shortDescription}
            </p>

            {productData.stockStatus && (
              <p
                className={`text-sm font-semibold mb-4 ${
                  (currentVariant && currentVariant.stock > 0) ||
                  (!currentVariant && productData.stock > 0)
                    ? "text-green-600"
                    : "text-red-500"
                }`}>
                {currentVariant
                  ? currentVariant.stock > 0
                    ? `In Stock (${currentVariant.stock} available)`
                    : "Out of Stock"
                  : productData.stock > 0
                  ? productData.stockStatus
                  : "Out of Stock"}
              </p>
            )}

            {/* Variants */}
            {availableColors.length > 0 && (
              <div className='mb-4'>
                <label className='block mb-1 font-medium text-gray-700'>
                  Color: <span className='font-normal'>{selectedColor}</span>
                </label>
                <div className='flex flex-wrap gap-2'>
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`cursor-pointer px-4 py-2 rounded-lg border text-sm transition-all
                          ${
                            selectedColor === color
                              ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                          }`}
                      title={color}
                      // You might want to represent colors visually if possible
                      // style={{ backgroundColor: color.toLowerCase() }} // Simplistic example, needs mapping to actual color codes
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedColor && availableSizesForSelectedColor.length > 0 && (
              <div className='mb-4'>
                <label className='block mb-1 font-medium text-gray-700'>
                  Size: <span className='font-normal'>{selectedSize}</span>
                </label>
                <div className='flex flex-wrap gap-2'>
                  {availableSizesForSelectedColor.map((size) => {
                    const variantForSize = productData.variants.find(
                      (v) => v.color === selectedColor && v.size === size
                    );
                    const isSizeDisabled =
                      !variantForSize || variantForSize.stock <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={isSizeDisabled}
                        className={`cursor-pointer px-4 py-2 rounded-lg border text-sm transition-all
                              ${
                                selectedSize === size && !isSizeDisabled
                                  ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 text-blue-700"
                                  : isSizeDisabled
                                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                              }`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 mt-6'>
              <button
                disabled={isCurrentVariantOutOfStock}
                className={`w-full sm:w-auto flex-grow bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                // Add onClick handler for adding to cart
              >
                Add to Cart
              </button>
              <button
                disabled={isCurrentVariantOutOfStock}
                className={`w-full sm:w-auto flex-grow bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                // Add onClick handler for buy now
              >
                Buy Now
              </button>
            </div>

            {/* Dimensions & Weight */}
            {productData.dimensions && (
              <div className='mt-6 text-sm text-gray-600'>
                <h3 className='font-semibold text-gray-700 mb-1'>
                  Dimensions:
                </h3>
                <p>
                  Length: {productData.dimensions.length}
                  {productData.dimensions.unit}, Width:{" "}
                  {productData.dimensions.width}
                  {productData.dimensions.unit}, Height:{" "}
                  {productData.dimensions.height}
                  {productData.dimensions.unit}
                </p>
              </div>
            )}
            {productData.weight && (
              <div className='mt-2 text-sm text-gray-600'>
                <h3 className='font-semibold text-gray-700 mb-1'>Weight:</h3>
                <p>
                  {productData.weight.value}
                  {productData.weight.unit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full Description & Tags */}
        <div className='py-10 mt-8 border-t'>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>
            Product Description
          </h2>
          <div
            className='prose prose-sm max-w-none text-gray-700' // Using Tailwind Typography for styling
            dangerouslySetInnerHTML={{ __html: productData.description }} // Assuming description can be HTML
          />
        </div>

        {productData.tags && productData.tags.length > 0 && (
          <div className='mt-6 pb-6 border-b'>
            <h3 className='text-md font-semibold text-gray-700 mb-2'>Tags:</h3>
            <div className='flex flex-wrap gap-2'>
              {productData.tags.map((tag) => (
                <div
                  key={tag}
                //   href={`/shop/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                  <span className='text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors'>
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailsClient;
