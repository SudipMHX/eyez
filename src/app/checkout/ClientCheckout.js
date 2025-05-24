"use client";

import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Wallet,
  HandCoins,
} from "lucide-react";

const ClientCheckout = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='container mx-auto py-20 px-5'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className='flex items-center gap-4 mb-12'>
            <ArrowLeft className='w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors' />
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Secure Checkout
            </h1>
          </motion.div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Left Column - Checkout Form */}
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='lg:col-span-2 space-y-8'>
              <motion.div variants={itemVariants}>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                  Contact Information
                </h2>
                <div className='space-y-4'>
                  <input
                    type='text'
                    placeholder='Full Name'
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                  />
                  <input
                    type='email'
                    placeholder='Email Address'
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                  />
                  <input
                    type='tel'
                    placeholder='Phone Number'
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                  Shipping Address
                </h2>
                <div className='space-y-4'>
                  <input
                    type='text'
                    placeholder='Street Address'
                    className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <input
                      type='text'
                      placeholder='City'
                      className='p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
                    />
                    <input
                      type='text'
                      placeholder='Postal Code'
                      className='p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
                    />
                  </div>
                  <select className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'>
                    <option disabled>Select Country</option>
                    <option selected>Bangladesh</option>
                    <option>United States</option>
                    <option>India</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                  Payment Method
                </h2>
                <div className='space-y-4'>
                  <motion.div className='flex items-center gap-4 p-4 ring ring-blue-400 hover:ring-2 hover:ring-blue-500 rounded-lg cursor-pointer'>
                    <CreditCard className='w-6 h-6 text-blue-600' />
                    <span className='font-medium'>Credit/Debit Card</span>
                  </motion.div>

                  <motion.div className='flex items-center gap-4 p-4 ring ring-blue-400 hover:ring-2 hover:ring-blue-500 rounded-lg cursor-pointer'>
                    <Wallet className='w-6 h-6 text-green-600' />
                    <span className='font-medium'>Mobile Wallet</span>
                  </motion.div>

                  <motion.div className='flex items-center gap-4 p-4 ring ring-blue-400 hover:ring-2 hover:ring-blue-500 rounded-lg cursor-pointer'>
                    <HandCoins className='w-6 h-6 text-purple-600' />
                    <span className='font-medium'>Cash on Delivery</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className='bg-white p-6 rounded-xl shadow-lg h-fit sticky top-8'>
              <h2 className='text-xl font-semibold mb-6 text-gray-800'>
                Order Summary
              </h2>

              <div className='space-y-4 mb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-gray-100 rounded-lg'></div>
                  <div>
                    <h3 className='font-medium'>Sun Glasses</h3>
                    <p className='text-sm text-gray-500'>1 × 1450৳</p>
                  </div>
                </div>
              </div>

              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span>Subtotal:</span>
                  <span className='font-medium'>1450৳</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping:</span>
                  <span className='font-medium'>60৳</span>
                </div>
                <div className='flex justify-between pt-3 border-t'>
                  <span className='font-semibold'>Total:</span>
                  <span className='text-lg font-bold text-blue-600'>1510৳</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className='cursor-pointer w-full py-4 bg-blue-600 text-white rounded-lg font-semibold mt-8 hover:bg-blue-700 transition-colors'>
                Place Order
              </motion.button>

              <div className='mt-6 text-center text-sm text-gray-500'>
                <Lock className='inline-block w-4 h-4 mr-2' />
                Secure SSL Encryption
              </div>
            </motion.div>
          </div>

          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='flex flex-wrap justify-center gap-6 mt-12'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <ShieldCheck className='w-5 h-5 text-green-600' />
              100% Purchase Protection
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Lock className='w-5 h-5 text-blue-600' />
              Secure Payment
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <AlertCircle className='w-5 h-5 text-purple-600' />
              24/7 Support
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ClientCheckout;
