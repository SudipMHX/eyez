"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Settings,
  BarChart2,
  Users,
  Package,
  ListTodo,
  CreditCard,
} from "lucide-react";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import DashboardHeader from "@/components/shared/DashboardHeader";
import DashboardSidebar from "@/components/shared/DashboardSidebar";

const menuItems = [
  { name: "Overview", icon: Home, path: "/dashboard" },
  { name: "Analytics", icon: BarChart2, path: "/dashboard/analytics" },
  { name: "Products", icon: Package, path: "/dashboard/products" },
  { name: "Orders", icon: ListTodo, path: "/dashboard/orders" },
  { name: "Payment", icon: CreditCard, path: "/dashboard/transactions" },
  { name: "Users", icon: Users, path: "/dashboard/users" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
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
      <DashboardHeader
        sidebarCollapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarWidth={sidebarWidth}
        pathname={pathname}
        isMobile={isMobile}
        menuItems={menuItems}
        sidebarCollapsed={sidebarCollapsed}
      />

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
