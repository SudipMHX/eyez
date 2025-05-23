"use client";
import Link from "next/link";
import Image from "next/image";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "@/assets/logo.png";

const Header = () => {
  const pathname = usePathname();

  const data = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Shop",
      link: "/shop",
    },
  ];

  return (
    <>
      <nav className='container mx-auto'>
        <div className='flex justify-between items-center py-4'>
          <div className='text-2xl font-bold'>
            <Link href='/'>
              <Image
                src={Logo}
                className='w-16'
                alt='EYEZ'
                width={100}
                height={100}
              />
            </Link>
          </div>
          <ul className='flex space-x-4 relative'>
            {data.map((item, index) => (
              <li key={index} className='relative'>
                <Link
                  href={item.link}
                  className={`${
                    pathname === item.link
                      ? "font-bold text-gray-900"
                      : "text-gray-700"
                  } font-medium hover:text-gray-950 transition-colors`}>
                  {item.name}
                </Link>
                {pathname === item.link && (
                  <span className='absolute left-0 right-0 -bottom-1 h-[2px] bg-gray-400 animate-slide-in'></span>
                )}
              </li>
            ))}
          </ul>
          <div className='flex items-center space-x-4'>
            <Link
              href='/cart'
              className='flex items-center border border-gray-300 p-2 rounded-lg relative hover:shadow-lg'>
              <ShoppingCart className='w-5 h-5' />
              <span className='ml-2'>Cart</span>
              <div className='absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full'>
                0
              </div>
            </Link>
            <Link
              className='bg-green-500 text-white px-4 font-semibold flex items-center p-2 rounded-lg hover:shadow-lg'
              href='/login'>
              Login
            </Link>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.3s ease-in-out forwards;
        }
        @keyframes slide-in {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </>
  );
};

export default Header;
