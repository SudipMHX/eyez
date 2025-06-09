import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, House, Logs, MapPinHouse, UserCog } from "lucide-react";

const UserAccountSidebar = () => {
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
    </>
  );
};

export default UserAccountSidebar;
