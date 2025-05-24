"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Trash2, TicketPercent, ScanBarcode, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const sampleCartItems = [
  {
    id: 1,
    name: "Sun Glasses",
    model: "FORGE",
    price: 1450,
    quantity: 2,
    image: "/images/01.jpg",
  },
  {
    id: 2,
    name: "Eye Glass",
    model: "Ray Ban RB2132",
    price: 1450,
    quantity: 1,
    image: "/images/01.jpg",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
};

const ClientCart = () => {
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const deliveryFee = 60;
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subTotal + deliveryFee;

  const breadcrumbsItems = [{ label: "Cart", href: "/cart" }];

  return (
    <section className='min-h-screen py-10 px-4 bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8'>
        {/* <Breadcrumbs items={breadcrumbsItems} /> */}
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className='flex items-center gap-4 mb-8'>
          <ArrowLeft className='w-6 h-6 text-gray-600 cursor-pointer' />
          <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Your Shopping Cart
          </h1>
        </motion.div>

        <LayoutGroup>
          <AnimatePresence mode='popLayout'>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-xl mb-4 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex-shrink-0'>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className='relative w-32 h-32 rounded-lg overflow-hidden'>
                    <Image
                      fill
                      src={item.image}
                      alt={item.name}
                      className='object-cover'
                    />
                  </motion.div>
                </div>

                <div className='flex-1 space-y-3'>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {item.name}
                  </h3>
                  <p className='text-sm text-gray-500'>{item.model}</p>
                  <div className='flex items-center justify-between gap-4 flex-wrap'>
                    <div className='space-x-2'>
                      <span className='text-lg font-medium text-blue-600'>
                        {item.price}৳
                      </span>
                      <span className='text-gray-400'>×</span>
                      <span className='text-gray-600'>{item.quantity}</span>
                    </div>
                    <div className='flex items-center gap-10 px-3 py-1 rounded-full'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() =>
                            setCartItems((prev) =>
                              prev.map((cartItem) =>
                                cartItem.id === item.id && item.quantity > 1
                                  ? {
                                      ...cartItem,
                                      quantity: cartItem.quantity - 1,
                                    }
                                  : cartItem
                              )
                            )
                          }
                          className='px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition'>
                          -
                        </button>
                        <input
                          type='number'
                          min='1'
                          value={item.quantity}
                          readOnly
                          className='w-10 rounded-full py-1 px-2 text-center focus:ring-2 focus:ring-blue-500 outline-none bg-white'
                        />
                        <button
                          onClick={() =>
                            setCartItems((prev) =>
                              prev.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      quantity: cartItem.quantity + 1,
                                    }
                                  : cartItem
                              )
                            )
                          }
                          className='px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition'>
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className='p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors cursor-pointer'>
                        <Trash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <motion.div
              className='bg-white p-6 rounded-xl shadow-sm'
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}>
              <div className='space-y-4'>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className='cursor-pointer w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <TicketPercent className='w-5 h-5 text-purple-600' />
                    <span className='font-medium'>Apply Coupon Code</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isCouponOpen ? 180 : 0 }}
                    className='text-gray-500'>
                    ▼
                  </motion.span>
                </motion.button>

                {isCouponOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className='flex gap-3'>
                    <input
                      type='text'
                      placeholder='Enter coupon code'
                      className='flex-1 px-4 py-2 rounded-lg ring ring-blue-300 focus:ring-2 focus:ring-blue-400 outline-none'
                    />
                    <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                      Apply
                    </button>
                  </motion.div>
                )}
              </div>

              <div className='mt-4 space-y-4'>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsVoucherOpen(!isVoucherOpen)}
                  className='cursor-pointer w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <ScanBarcode className='w-5 h-5 text-green-600' />
                    <span className='font-medium'>Use Gift Voucher</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isVoucherOpen ? 180 : 0 }}
                    className='text-gray-500'>
                    ▼
                  </motion.span>
                </motion.button>

                {isVoucherOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className='flex gap-3'>
                    <input
                      type='text'
                      placeholder='Enter voucher code'
                      className='flex-1 px-4 py-2 rounded-lg ring ring-blue-300 focus:ring-2 focus:ring-blue-400 outline-none'
                    />
                    <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                      Apply
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className='bg-gray-900 text-white p-6 rounded-xl shadow-lg sticky top-8'
            initial={{ y: 20 }}
            animate={{ y: 0 }}>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-300'>Subtotal:</span>
                <span className='text-xl font-bold'>{subTotal}৳</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-300'>Delivery:</span>
                <span className='text-xl font-bold'>{deliveryFee}৳</span>
              </div>
              <div className='pt-4 border-t border-gray-700'>
                <div className='flex justify-between items-center'>
                  <span className='text-xl'>Total:</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className='text-2xl font-bold text-green-400'>
                    {total}৳
                  </motion.span>
                </div>
              </div>
            </div>

            <div className='mt-8 space-y-5'>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className='cursor-pointer w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-colors'>
                <Link className='block' href='/checkout'>
                  Confirm Order
                </Link>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className='w-full py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors'>
                <Link className='block' href='/shop'>
                  Continue Shopping
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientCart;
