import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <div className='bg-gray-100 text-gray-700'>
      <div className='container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Logo and Description */}
        <div>
          <Image
            src={Logo}
            alt='eyez logo'
            className='w-16'
            width={256}
            height={256}
          />
          <p className='mt-4 text-sm'>
            Shop the latest trends and timeless classics. Fast shipping,
            reliable service.
          </p>
          <div className='flex gap-4 mt-4'>
            <Link href='#'>
              <Facebook className='hover:text-blue-600 transition' />
            </Link>
            <Link href='#'>
              <Instagram className='hover:text-pink-500 transition' />
            </Link>
            <Link href='#'>
              <Twitter className='hover:text-sky-400 transition' />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='/shop'>Shop</Link>
            </li>
            <li>
              <Link href='/about'>About Us</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>
            <li>
              <Link href='/faq'>FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Customer Service</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='/returns-policy'>Returns</Link>
            </li>
            <li>
              <Link href='/shipping-info'>Shipping Info</Link>
            </li>
            <li>
              <Link href='/terms-and-condition'>Terms & Conditions</Link>
            </li>
            <li>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-center gap-2'>
              <Mail className='w-4 h-4' /> support@eyez.com
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='w-4 h-4' /> +1 234 567 890
            </li>
            <li className='flex items-center gap-2'>
              <MapPin className='w-4 h-4' /> 123 Commerce St, NY
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='bg-gray-200 text-center text-sm py-4'>
        © {new Date().getFullYear()} EYEZ. All rights reserved. | Designed &
        Developed by{" "}
        <Link
          className='hover:text-blue-500'
          href='https://sudipmhx.vercel.app'
          target='_blank'>
          SudipMHX
        </Link>
      </div>
    </div>
  );
};

export default Footer;
