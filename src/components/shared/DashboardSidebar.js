"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

const DashboardSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  menuItems,
  sidebarCollapsed,
  sidebarWidth,
  pathname,
}) => {
  return (
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
  );
};

export default DashboardSidebar;
