"use client";
import { Menu, X, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { useSession } from "next-auth/react";

const DashboardHeader = ({
  toggleSidebar,
  isMobile,
  sidebarOpen,
  sidebarCollapsed,
}) => {
  const { data: session, status } = useSession();

  return (
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
          <span className='text-sm font-semibold uppercase'>
            {session?.user?.role}
          </span>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <User className='w-6 h-6 text-gray-500 cursor-pointer' />
          </button>
          <button className='p-2 rounded-full hover:bg-gray-100 cursor-pointer'>
            <LogOut className='w-6 h-6 text-gray-500' />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
