"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import ReactPlayer from "react-player";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const ProductDetailsPage = () => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Red");
  const [selectedSize, setSelectedSize] = useState("M");

  const product = {
    title: "Modern Stylish Jacket",
    price: 129.99,
    deliveryCharge: 4.99,
    images: [
      "/images/01.jpg",
      "/images/01.jpg",
      "/images/01.jpg",
      "/images/01.jpg",
    ],
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    colors: ["Red", "Black", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    short_description:
      "This modern stylish jacket is perfect for all seasons, made from premium materials ensuring durability and comfort.",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };

  const mediaItems = product.video
    ? [product.video, ...product.images]
    : [...product.images];

  const openLightbox = (image) => {
    setSelectedMediaIndex(mediaItems.indexOf(image));
    setShowLightbox(true);
  };

  const selectedMedia = mediaItems[selectedMediaIndex];
  const isVideo = product.video && selectedMediaIndex === 0;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: "Shop", href: "/shop" }, { label: product.title }]}
      />

      <div className='grid md:grid-cols-2 gap-8'>
        {/* Carousel */}
        <div className='space-y-4'>
          <div className='rounded-xl overflow-hidden h-[300px] bg-gray-100 flex items-center justify-center'>
            {isVideo ? (
              <ReactPlayer
                url={selectedMedia}
                controls
                width='100%'
                height='300px'
              />
            ) : (
              <div
                className='relative w-full h-[300px] cursor-pointer'
                onClick={() => openLightbox(selectedMedia)}>
                <Image
                  src={selectedMedia}
                  alt='Selected Media'
                  fill
                  className='object-contain rounded-xl'
                />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className='flex gap-2 overflow-x-auto'>
            {mediaItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedMediaIndex(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedMediaIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                } cursor-pointer bg-white flex items-center justify-center`}>
                {product.video && index === 0 ? (
                  <div className='text-sm text-center text-gray-600'>Video</div>
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={item}
                      alt={`Thumbnail ${index}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {showLightbox && !isVideo && (
            <div
              className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'
              onClick={() => setShowLightbox(false)}>
              <div className='relative w-4/5 h-[80vh]'>
                <Image
                  src={selectedMedia}
                  alt='Lightbox Preview'
                  fill
                  className='object-contain rounded-xl'
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className='text-3xl font-bold mb-4 text-gray-900'>
            {product.title}
          </h1>
          <p className='text-xl text-gray-700 mb-2'>
            ${product.price.toFixed(2)}
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Delivery charge: ${product.deliveryCharge.toFixed(2)}
          </p>

          {/* Variants */}
          <div className='mb-4'>
            <label className='block mb-1 font-medium'>Choose Color:</label>
            <div className='flex gap-2'>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`cursor-pointer px-4 py-2 rounded-lg border ${
                    selectedColor === color
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className='mb-4'>
            <label className='block mb-1 font-medium'>Choose Size:</label>
            <div className='flex gap-2'>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`cursor-pointer px-4 py-2 rounded-lg border ${
                    selectedSize === size
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className='text-gray-600 mb-6'>{product.short_description}</p>

          {/* Buttons */}
          <div className='flex gap-4'>
            <button className='bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-blue-700'>
              Add to Cart
            </button>
            <button className='bg-green-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-green-700'>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className='py-10'>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
