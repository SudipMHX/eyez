import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }) => {
  if (!product) {
    return;
  }

  const {
    name,
    slug,
    shortDescription,
    price,
    compareAtPrice,
    category,
    brand,
    images,
    stock,
    stockStatus,
    featured,
  } = product;

  const imageUrl =
    images && images.length > 0 ? images[0].src : "/image/01.jpg";
  const imageAlt =
    images && images.length > 0 ? images[0].alt : name || "Product image";
  const isOutOfStock = stockStatus === "Out of Stock" || stock === 0;

  return (
    <div className='relative bg-white shadow-lg md:max-w-sm rounded-xl overflow-hidden hover:scale-[101%] transition-transform duration-300 group'>
      {featured && (
        <div className='absolute top-2 right-2 bg-white text-xs font-semibold px-2 py-1 rounded-full z-10 flex items-center'>
          <Star className='mr-1' size={16} /> Featured
        </div>
      )}
      <Link href={`/shop/${slug}`} passHref>
        <div className='block'>
          <div className='relative w-full h-60 md:h-56 overflow-hidden'>
            <Image
              className='w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300'
              src={imageUrl}
              alt={imageAlt}
              layout='fill' // Use layout="fill" for responsive images within a sized container
              // width and height are not needed with layout="fill" if parent has dimensions
            />
            {isOutOfStock && (
              <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <span className='text-white text-lg font-semibold'>
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className='px-4 py-3'>
        <div className='flex justify-between'>
          {category && <p className='text-xs text-gray-500'>{category.name}</p>}
          {brand && <p className='text-xs text-gray-600'>{brand}</p>}
        </div>

        <hr className='h-px my-2 bg-gray-200 border-0' />

        <h2 className='font-bold text-lg mb-1 truncate hover:text-blue-700 transition-colors'>
          <Link href={`/shop/${slug}`}>{name}</Link>
        </h2>

        <p className='text-gray-700 text-sm h-10 overflow-hidden mb-3'>
          {shortDescription}
        </p>

        <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200'>
          {/* Price Section */}
          <div className='flex flex-col'>
            <span className='text-lg font-medium text-gray-800'>
              ${price.toFixed(2)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className='text-xs text-red-500 line-through'>
                Save ${(compareAtPrice - price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Button Section */}
          <button
            className={`flex items-center justify-center text-xs font-bold py-2 px-3 rounded-full transition-colors duration-200 cursor-pointer ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
                : "border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            }`}
            disabled={isOutOfStock}
            onClick={() => console.log(`Add to cart: ${product._id}`)}>
            <ShoppingCart className='mr-1.5 h-3.5 w-3.5' />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
