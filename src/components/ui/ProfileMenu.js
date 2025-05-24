"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const ProfileMenu = () => {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileItems = [
    { name: "Profile", link: "/account" },
    { name: "Orders", link: "/account/orders" },
    { name: "Wishlist", link: "/account/wishlist" },
    { name: "Settings", link: "/account/info" },
  ];

  return (
    <div className='relative'>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className='flex items-center border border-gray-300 p-2 rounded-full relative hover:shadow-lg cursor-pointer'>
        <User />
      </button>
      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'>
            <ul className='text-sm'>
              {profileItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                      pathname === item.link ? "font-bold text-gray-900" : ""
                    }`}>
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => [
                    signOut({ callbackUrl: "/" }),
                    setIsProfileMenuOpen(false),
                  ]}
                  className='w-full text-left font-bold block px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-500 cursor-pointer'>
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
