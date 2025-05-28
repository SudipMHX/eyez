"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import Logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileMenu from "../ui/ProfileMenu";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (isDashboard) {
    return;
  }

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -80 }}
        transition={{ duration: 0.3 }}
        className='fixed top-0 left-0 w-full z-50 bg-white shadow-md'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          {/* Logo */}
          <Link href='/'>
            <Image src={Logo} alt='EYEZ' width={60} height={60} />
          </Link>

          {/* Desktop Nav */}
          <ul className='hidden md:flex space-x-6'>
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`${
                    pathname === item.link
                      ? "font-bold text-gray-900"
                      : "text-gray-700"
                  } font-medium hover:text-gray-950 transition-colors relative`}>
                  {item.name}
                  {pathname === item.link && (
                    <span className='absolute left-0 right-0 -bottom-1 h-[2px] bg-gray-400 animate-slide-in'></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className='hidden md:flex items-center space-x-4 relative'>
            <Link
              href='/cart'
              className='flex items-center border border-gray-300 p-2 rounded-lg relative hover:shadow-lg'>
              <ShoppingCart className='w-5 h-5' />
              <span className='ml-2'>Cart</span>
              <div className='absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full'>
                0
              </div>
            </Link>
            {session?.user ? (
              <>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link
                  className='bg-green-500 text-white px-4 font-semibold flex items-center p-2 rounded-lg hover:shadow-lg'
                  href='/auth/login'>
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className='flex items-center gap-5 md:hidden'>
            {session?.user && <ProfileMenu />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle menu'>
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='md:hidden bg-white px-4 pb-4'>
              <ul className='flex flex-col space-y-4'>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      onClick={() => setIsMenuOpen(false)}
                      href={item.link}
                      className={`block ${
                        pathname === item.link
                          ? "font-bold text-gray-900"
                          : "text-gray-700"
                      } font-medium hover:text-gray-950 transition-colors`}>
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href='/cart'
                    onClick={() => setIsMenuOpen(false)}
                    className='flex items-center border border-gray-300 p-2 rounded-lg relative hover:shadow-lg'>
                    <ShoppingCart className='w-5 h-5' />
                    <span className='ml-2'>Cart</span>
                    <div className='absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full'>
                      0
                    </div>
                  </Link>
                </li>
                {!session?.user && (
                  <li>
                    <Link
                      href='/auth/login'
                      onClick={() => setIsMenuOpen(false)}
                      className='bg-green-500 text-white px-4 font-semibold flex items-center p-2 rounded-lg hover:shadow-lg'>
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer so content isn't hidden under fixed nav */}
      <div className='h-20'></div>
    </>
  );
};

export default Header;
