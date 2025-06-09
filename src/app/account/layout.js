"use client";

import UserAccountSidebar from "@/components/shared/UserAccountSidebar";

const layout = ({ children }) => {
  return (
    <>
      <section className='min-h-screen bg-gray-50 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row'>
            {/* Sidebar */}
            <UserAccountSidebar />
            {/* Main Content */}
            <main className='flex-1 p-6 pr-4 min-h-screen'>{children}</main>
          </div>
        </div>
      </section>
    </>
  );
};

export default layout;
