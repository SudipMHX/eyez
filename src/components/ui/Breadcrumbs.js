import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items }) => {
  return (
    <div className='flex items-center text-gray-500 mb-4 space-x-2 pb-2'>
      <Link className='flex items-center gap-2' href='/'>
        <Home className='text-xl' /> Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className='flex items-center space-x-2'>
          <ChevronRight />
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className='text-gray-800 font-semibold'>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
