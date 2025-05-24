"use client";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ClientForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      if (!res.ok) {
        setError(text);
        return;
      }

      setSuccess("Check your email for the reset link.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
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

export default ClientForgotPassword;
