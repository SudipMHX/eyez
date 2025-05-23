import Image from "next/image";

import Sunglass from "@/assets/sunglasses/01.jpg";
import Link from "next/link";

const ProductCard = () => {
  return (
    <div className='bg-white shadow md:max-w-sm rounded-xl overflow-hidden hover:scale-[101%] transition-transform duration-300'>
      <Image
        className='w-full h-60 md:h-48 object-cover'
        src={Sunglass}
        alt='Product'
        width={300}
        height={300}
      />
      <div className='px-4 py-2'>
        <h2 className='font-bold text-xl mb-2 hover:text-blue-900'>
          <Link href='/shop/xoxo'>Product Name</Link>
        </h2>
        <p className='text-gray-700 text-base'>
          This is a short description of the product. It highlights key features
          and benefits.
        </p>
        <div className='flex justify-between items-center mt-4'>
          <span className='text-lg font-semibold text-green-600'>$99.99</span>
          <button className='cursor-pointer border border-gray-200 px-3 rounded-2xl'>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
