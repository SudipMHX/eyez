"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  BarChart2,
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import useMediaQuery from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Overview", icon: Home, path: "/dashboard" },
  { name: "Analytics", icon: BarChart2, path: "/dashboard/analytics" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  { name: "Docs", icon: BookOpen, path: "/dashboard/docs" },
  { name: "Components", icon: Layers, path: "/dashboard/components" },
  { name: "Help", icon: HelpCircle, path: "/dashboard/help" },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

  return (
    <div className='antialiased bg-gray-50 min-h-screen'>
      {/* Navbar */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2.5'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-row-reverse items-center gap-2'>
            <button
              onClick={toggleSidebar}
              className='p-2 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer'
              aria-label='Toggle sidebar'>
              {isMobile ? (
                <>
                  {sidebarOpen ? (
                    <X className='w-6 h-6' />
                  ) : (
                    <Menu className='w-6 h-6' />
                  )}
                </>
              ) : sidebarCollapsed ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
              )}
            </button>
            <div className='flex items-center gap-2'>
              <Image src={Logo} alt='Logo' width={45} height={45} />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold uppercase'>Admin</span>
            <button className='p-2 rounded-full hover:bg-gray-100'>
              <User className='w-6 h-6 text-gray-500 cursor-pointer' />
            </button>
            <button className='p-2 rounded-full hover:bg-gray-100 cursor-pointer'>
              <LogOut className='w-6 h-6 text-gray-500' />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            key='sidebar'
            initial={{ x: isMobile ? -300 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -300 : 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 z-40 h-screen pt-14 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${sidebarWidth} ${
              isMobile ? "shadow-lg" : ""
            }`}
            aria-label='Sidebar'>
            <div className='flex flex-col h-full'>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className='absolute z-[999] top-20 -right-12 p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer'
                  aria-label='Close sidebar'>
                  <X className='w-6 h-6' />
                </button>
              )}
              <nav className='flex-1 px-3 py-6 space-y-2'>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`${
                      pathname === item.path && "bg-gray-100 font-bold"
                    } flex ${
                      sidebarCollapsed && "justify-center"
                    } items-center gap-3 p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition`}
                    onClick={() => isMobile && setSidebarOpen(false)}>
                    <item.icon className='w-5 h-5' />
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -15, opacity: 0 }}>
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-20 transition-all duration-300 ${
          !isMobile ? `${sidebarCollapsed ? "ml-20" : "ml-64"}` : ""
        }`}>
        <div className='p-4'>{children}</div>
      </main>
    </div>
  );
}
