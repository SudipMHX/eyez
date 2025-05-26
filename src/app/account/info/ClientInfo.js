"use client";

import { useEffect, useState } from "react";
import { SpinnerLoader } from "@/components/ui/LoadingAnimations";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ClientInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const phone_number = form.phone_number.value;
    const emailUpdate = form["email-update"].checked;
    const productUpdate = form["product-update"].checked;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone_number,
          preferences: {
            promotionalEmails: emailUpdate,
            productUpdates: productUpdate,
          },
        }),
      });

      if (!res.ok) {
        Swal.fire({
          title: "Something went wrong!",
          timer: 1500,
          icon: "error",
        });
      }

      const data = await res.json();
      Swal.fire({
        title: "User Settings Saved!",
        timer: 1500,
        icon: "success",
      });
      setUserData(data.data);
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: error,
        timer: 1500,
        icon: "error",
      });
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUserData(data.data); // assuming your API returns { success, data }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <section>
      {isLoading ? (
        <>
          <SpinnerLoader />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}>
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                User Info
              </h2>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='name'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      defaultValue={userData?.name}
                      placeholder='Full Name'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='email'>
                      E-mail Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      defaultValue={userData?.email}
                      placeholder='E-mail Address'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-600' htmlFor='number'>
                      Phone Number
                    </label>
                    <input
                      type='number'
                      id='number'
                      name='phone_number'
                      defaultValue={userData?.phone_number}
                      placeholder='Phone Number'
                      className='w-full p-3 rounded-lg focus:ring-2 ring ring-blue-400 focus:ring-blue-500 outline-none'
                      required
                    />
                  </div>
                </div>
              </div>
              <h2 className='text-xl font-semibold mt-6 mb-4 text-gray-800'>
                User Preferences
              </h2>
              <div className='space-y-3'>
                <div className='flex items-center gap-4'>
                  <input
                    className='w-4 h-4 rounded-full cursor-pointer'
                    type='checkbox'
                    defaultChecked={userData?.preferences?.promotionalEmails}
                    name='email-update'
                    id='email-update'
                  />
                  <label
                    htmlFor='email-update'
                    className='select-none cursor-pointer'>
                    Receive promotional emails and updates
                  </label>
                </div>
                <div className='flex items-center gap-4'>
                  <input
                    className='w-4 h-4 rounded-full cursor-pointer'
                    defaultChecked={userData?.preferences?.productUpdates}
                    type='checkbox'
                    name='product-update'
                    id='product-update'
                  />
                  <label
                    htmlFor='product-update'
                    className='select-none cursor-pointer'>
                    Receive new product announcements
                  </label>
                </div>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  type='submit'
                  className='bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-3'>
                  Update
                  {isSubmitting && (
                    <div className='w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  )}
                </button>
              </div>
            </motion.div>
          </form>
        </>
      )}
    </section>
  );
};

export default ClientInfo;
