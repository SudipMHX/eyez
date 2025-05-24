"use client";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ClientResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        setError(text);
        return;
      }

      setSuccess("Password successfully reset!");
      setPassword("");
      setTimeout(() => router.push("/auth/login"), 2000); // redirect to login
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section>
      <div className='container mx-auto py-20 px-5'>
        <form onSubmit={handleSubmit} className='space-y-4 max-w-xl mx-auto'>
          <motion.div variants={itemVariants}>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              New Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-3 py-3 rounded-lg ring ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none'
                placeholder='Enter your new password'
                required
              />
            </div>
          </motion.div>
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            type='submit'
            className='cursor-pointer w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
            Reset Password
          </motion.button>
          {error && (
            <p className='bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded-lg'>
              {error}
            </p>
          )}
          {success && (
            <p className='bg-green-600 text-white px-2 py-1 text-sm font-semibold rounded-lg'>
              {success}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ClientResetPassword;
