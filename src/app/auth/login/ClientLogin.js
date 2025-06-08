"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, AlertCircle, ShieldUser } from "lucide-react";
import Link from "next/link";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: redirect,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push(result.url || redirect);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='container mx-auto py-10 px-5'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8'>
          <div className='text-center mb-8'>
            <motion.h1
              variants={itemVariants}
              className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
              Welcome Back
            </motion.h1>
            <motion.p variants={itemVariants} className='text-gray-600'>
              Sign in to continue to your account
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex items-center gap-2 bg-red-50 p-3 rounded-lg mb-4 text-red-600'>
              <AlertCircle className='w-5 h-5' />
              <span className='text-sm'>{error}</span>
            </motion.div>
          )}

          <div className='space-y-4'>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className='w-full flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-colors cursor-pointer'
              disabled>
              <ShieldUser className='w-5 h-5' />
              Continue with Google
            </motion.button>
          </div>

          <motion.div
            variants={itemVariants}
            className='flex items-center my-8'>
            <div className='flex-1 border-t border-gray-200'></div>
            <span className='px-4 text-sm text-gray-500'>or</span>
            <div className='flex-1 border-t border-gray-200'></div>
          </motion.div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <motion.div variants={itemVariants}>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
                  placeholder='Enter your email'
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='password'
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
                  placeholder='Enter your password'
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='flex items-center justify-between'>
              <label className='flex items-center gap-2 text-sm text-gray-600'>
                <input
                  type='checkbox'
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                Remember me
              </label>
              <Link
                href='/auth/forgot-password'
                className='text-sm text-blue-600 hover:text-blue-700'>
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='cursor-pointer w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Sign In
            </motion.button>
          </form>

          <motion.p
            variants={itemVariants}
            className='text-center text-sm text-gray-600 mt-6'>
            Don&apos;t have an account?{" "}
            <Link
              href='/auth/register'
              className='text-blue-600 hover:text-blue-700 font-semibold'>
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ClientLogin;
