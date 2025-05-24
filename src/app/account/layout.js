"use client";
import { Heart, House, Logs, MapPinHouse, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  const pathname = usePathname();

  const menuData = [
    { name: "Home", link: "/account", icon: House },
    { name: "Orders", link: "/account/orders", icon: Logs },
    { name: "Wishlist", link: "/account/wishlist", icon: Heart },
    { name: "Address", link: "/account/address", icon: MapPinHouse },
    { name: "Settings", link: "/account/info", icon: UserCog },
  ];

  return (
    <>
      <section className='min-h-screen bg-gray-50 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row'>
            <aside className='w-full md:w-72 p-6 pr-4 md:block shrink-0'>
              <div className='sticky top-6 space-y-8'>
                <div className='space-y-4 bg-white p-5 rounded-xl shadow-xs'>
                  <h3 className='text-lg font-semibold'>Account Info</h3>
                  <ul className='space-y-2'>
                    {menuData.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.link}
                          className={`px-3 py-2 rounded-lg flex items-center gap-3 ${
                            pathname === item.link && "bg-amber-200"
                          }`}>
                          <item.icon className='w-5 h-5' />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 p-6 pr-4 min-h-screen'>{children}</main>
          </div>
        </div>
      </section>
    </>
  );
};

export default layout;
